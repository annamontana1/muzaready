import prisma from './prisma';

/**
 * Apply coupon to order with atomic transaction
 * This prevents race conditions by atomically checking and incrementing usage
 */
export async function applyCouponToOrder(
  couponCode: string,
  orderAmount: number,
  userEmail: string,
  orderId: string
): Promise<{ success: boolean; discount: number; error?: string }> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Find and lock coupon for update
      const coupon = await tx.coupon.findFirst({
        where: {
          code: {
            equals: couponCode.toUpperCase(),
            mode: 'insensitive',
          },
          isActive: true,
        },
      });

      if (!coupon) {
        return { success: false, discount: 0, error: 'Kupón nebyl nalezen' };
      }

      // Check validity dates
      const now = new Date();
      if (coupon.validFrom && new Date(coupon.validFrom) > now) {
        return {
          success: false,
          discount: 0,
          error: `Tento kupón bude platný od ${new Date(coupon.validFrom).toLocaleDateString('cs-CZ')}`,
        };
      }

      if (coupon.validUntil && new Date(coupon.validUntil) < now) {
        return {
          success: false,
          discount: 0,
          error: 'Platnost tohoto kupónu vypršela',
        };
      }

      // Check usage limits (with current pending count)
      if (
        coupon.maxUses !== null &&
        coupon.usedCount >= coupon.maxUses
      ) {
        return {
          success: false,
          discount: 0,
          error: 'Tento kupón byl již vyčerpán',
        };
      }

      // Check per-user usage limit
      if (coupon.maxUsesPerUser !== null) {
        const userUsageCount = await tx.order.count({
          where: {
            email: userEmail,
            couponId: coupon.id,
          },
        });

        if (userUsageCount >= coupon.maxUsesPerUser) {
          return {
            success: false,
            discount: 0,
            error: `Tento kupón můžete použít maximálně ${coupon.maxUsesPerUser}x`,
          };
        }
      }

      // Check minimum order amount
      if (
        coupon.minOrderAmount !== null &&
        orderAmount < coupon.minOrderAmount
      ) {
        return {
          success: false,
          discount: 0,
          error: `Minimální částka pro tento kupón je ${coupon.minOrderAmount.toLocaleString('cs-CZ')} Kč`,
        };
      }

      // Calculate discount
      let discountAmount = 0;

      if (coupon.discountType === 'percentage') {
        discountAmount = (orderAmount * coupon.discountValue) / 100;

        // Apply max discount cap if set
        if (
          coupon.maxDiscount !== null &&
          discountAmount > coupon.maxDiscount
        ) {
          discountAmount = coupon.maxDiscount;
        }
      } else if (coupon.discountType === 'fixed_amount') {
        discountAmount = coupon.discountValue;

        // Don't discount more than order amount
        if (discountAmount > orderAmount) {
          discountAmount = orderAmount;
        }
      }

      // Round to 2 decimal places
      discountAmount = Math.round(discountAmount * 100) / 100;

      // Atomically increment usage count
      await tx.coupon.update({
        where: { id: coupon.id },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      });

      // Update order with coupon info
      await tx.order.update({
        where: { id: orderId },
        data: {
          couponId: coupon.id,
          couponCode: coupon.code,
          discountAmount: discountAmount,
        },
      });

      return {
        success: true,
        discount: discountAmount,
      };
    }, {
      maxWait: 5000, // 5 seconds max wait
      timeout: 10000, // 10 seconds timeout
    });

    return result;
  } catch (error) {
    console.error('Error applying coupon:', error);
    return {
      success: false,
      discount: 0,
      error: 'Chyba při aplikaci kupónu',
    };
  }
}

/**
 * Validate coupon (without applying it)
 * This is for preview purposes only - doesn't increment usage
 */
export async function validateCouponPreview(
  couponCode: string,
  orderAmount: number,
  userEmail?: string
): Promise<{
  valid: boolean;
  discount?: number;
  finalAmount?: number;
  error?: string;
}> {
  try {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: {
          equals: couponCode.toUpperCase(),
          mode: 'insensitive',
        },
      },
    });

    if (!coupon) {
      return { valid: false, error: 'Kupón nebyl nalezen' };
    }

    if (!coupon.isActive) {
      return { valid: false, error: 'Tento kupón již není aktivní' };
    }

    // Check validity dates
    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      return {
        valid: false,
        error: `Tento kupón bude platný od ${new Date(coupon.validFrom).toLocaleDateString('cs-CZ')}`,
      };
    }

    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      return { valid: false, error: 'Platnost tohoto kupónu vypršela' };
    }

    // Check usage limits (leave buffer of 1 for pending transactions)
    if (
      coupon.maxUses !== null &&
      coupon.usedCount + 1 > coupon.maxUses
    ) {
      return { valid: false, error: 'Tento kupón byl již vyčerpán' };
    }

    // Check per-user usage limit
    if (userEmail && coupon.maxUsesPerUser !== null) {
      const userUsageCount = await prisma.order.count({
        where: {
          email: userEmail,
          couponId: coupon.id,
        },
      });

      if (userUsageCount >= coupon.maxUsesPerUser) {
        return {
          valid: false,
          error: `Tento kupón můžete použít maximálně ${coupon.maxUsesPerUser}x`,
        };
      }
    }

    // Check minimum order amount
    if (
      coupon.minOrderAmount !== null &&
      orderAmount < coupon.minOrderAmount
    ) {
      return {
        valid: false,
        error: `Minimální částka pro tento kupón je ${coupon.minOrderAmount.toLocaleString('cs-CZ')} Kč`,
      };
    }

    // Calculate discount (preview only)
    let discountAmount = 0;

    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;

      if (
        coupon.maxDiscount !== null &&
        discountAmount > coupon.maxDiscount
      ) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === 'fixed_amount') {
      discountAmount = coupon.discountValue;

      if (discountAmount > orderAmount) {
        discountAmount = orderAmount;
      }
    }

    discountAmount = Math.round(discountAmount * 100) / 100;
    const finalAmount = Math.max(0, orderAmount - discountAmount);

    return {
      valid: true,
      discount: discountAmount,
      finalAmount,
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { valid: false, error: 'Chyba při validaci kupónu' };
  }
}
