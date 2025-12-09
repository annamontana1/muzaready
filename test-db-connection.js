/**
 * Test připojení k Supabase databázi
 * 
 * Použití:
 *   node test-db-connection.js
 * 
 * Zkusí připojení s heslem z .env.local
 */

require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔍 Testuji připojení k databázi...\n');

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL není nastaveno v .env.local');
    return;
  }

  // Mask password in URL for logging
  const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':***@');
  console.log(`📋 Connection string: ${maskedUrl}\n`);

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  try {
    console.log('⏳ Zkouším připojení...');
    
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    
    console.log('✅ Připojení úspěšné! Databáze je dostupná.\n');
    console.log('💡 Heslo v .env.local je správné ✅\n');
    
    // Test, jestli můžeme číst z databáze
    try {
      const adminCount = await prisma.adminUser.count();
      console.log(`📊 Počet admin uživatelů: ${adminCount}`);
    } catch (e) {
      console.log('⚠️  Nemůžu číst z databáze (možná chybí tabulky)');
    }

  } catch (error) {
    console.error('❌ Připojení selhalo!\n');
    
    if (error.message.includes('password') || error.message.includes('authentication')) {
      console.error('🔐 CHYBA: Heslo je nesprávné nebo autentizace selhala');
      console.error('\n💡 Řešení:');
      console.error('   1. Jdi na Supabase Dashboard → Settings → Database');
      console.error('   2. Resetuj database password');
      console.error('   3. Aktualizuj .env.local s novým heslem');
    } else if (error.message.includes("Can't reach database server")) {
      console.error('🌐 CHYBA: Databáze není dostupná');
      console.error('\n💡 Možné příčiny:');
      console.error('   1. Projekt je paused v Supabase Dashboard → Resume');
      console.error('   2. Firewall blokuje připojení');
      console.error('   3. Špatná IP adresa nebo port');
    } else {
      console.error('❌ Chyba:', error.message);
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

