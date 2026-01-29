'use client';

import { useState, useRef } from 'react';

interface CsvRow {
  category: string;
  tier: string;
  shade: string;
  structure: string;
  lengthCm: string;
  initialGrams: string;
  pricePerGramCzk?: string;
  location?: string;
  batchNumber?: string;
  weightTotalG?: string;
  saleMode?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  rows: CsvRow[];
}

const EXAMPLE_CSV = `category,tier,shade,structure,lengthCm,initialGrams,pricePerGramCzk,location,batchNumber
UNBARVENE,STANDARD,1,STRAIGHT,45,500,,Showroom Praha,2025-01-A
UNBARVENE,STANDARD,1,STRAIGHT,50,300,,Showroom Praha,2025-01-A
UNBARVENE,LUXE,3,WAVY,55,200,4.5,Showroom Praha,2025-01-B
BARVENE,LUXE,7,STRAIGHT,60,400,,Sklad,2025-01-C`;

const REQUIRED_COLUMNS = ['category', 'tier', 'shade', 'structure', 'lengthCm', 'initialGrams'];
const VALID_CATEGORIES = ['UNBARVENE', 'BARVENE'];
const VALID_TIERS = ['STANDARD', 'LUXE', 'PLATINUM_EDITION'];
const VALID_STRUCTURES = ['STRAIGHT', 'WAVY', 'CURLY'];

function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || '';
    });
    return row;
  });

  return { headers, rows };
}

function validateRows(rows: Record<string, string>[]): ValidationResult {
  const errors: string[] = [];
  const validRows: CsvRow[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const lineNum = i + 2; // +2 for header + 0-index

    // Check required columns
    for (const col of REQUIRED_COLUMNS) {
      if (!row[col]) {
        errors.push(`Radek ${lineNum}: chybi "${col}"`);
      }
    }

    // Validate values
    if (row.category && !VALID_CATEGORIES.includes(row.category)) {
      errors.push(`Radek ${lineNum}: neplatna category "${row.category}" (povolene: ${VALID_CATEGORIES.join(', ')})`);
    }
    if (row.tier && !VALID_TIERS.includes(row.tier)) {
      errors.push(`Radek ${lineNum}: neplatny tier "${row.tier}" (povolene: ${VALID_TIERS.join(', ')})`);
    }
    if (row.structure && !VALID_STRUCTURES.includes(row.structure)) {
      errors.push(`Radek ${lineNum}: neplatna structure "${row.structure}" (povolene: ${VALID_STRUCTURES.join(', ')})`);
    }
    const shade = Number(row.shade);
    if (row.shade && (isNaN(shade) || shade < 1 || shade > 10)) {
      errors.push(`Radek ${lineNum}: neplatny shade "${row.shade}" (1-10)`);
    }
    const length = Number(row.lengthCm);
    if (row.lengthCm && (isNaN(length) || length < 20 || length > 120)) {
      errors.push(`Radek ${lineNum}: neplatna delka "${row.lengthCm}" (20-120)`);
    }

    if (errors.length === 0 || errors.every(e => !e.includes(`Radek ${lineNum}`))) {
      validRows.push({
        category: row.category,
        tier: row.tier,
        shade: row.shade,
        structure: row.structure,
        lengthCm: row.lengthCm,
        initialGrams: row.initialGrams || '0',
        pricePerGramCzk: row.pricePerGramCzk || undefined,
        location: row.location || undefined,
        batchNumber: row.batchNumber || undefined,
        weightTotalG: row.weightTotalG || undefined,
        saleMode: row.saleMode || undefined,
      });
    }
  }

  return { valid: errors.length === 0, errors, rows: validRows };
}

export default function BulkImportTab() {
  const [csvText, setCsvText] = useState('');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      handleValidate(text);
    };
    reader.readAsText(file);
  };

  const handleValidate = (text?: string) => {
    const input = text || csvText;
    if (!input.trim()) {
      setValidation(null);
      return;
    }

    const { rows } = parseCsv(input);
    const result = validateRows(rows);
    setValidation(result);
    setResults(null);
    setError('');
  };

  const handleImport = async () => {
    if (!validation || !validation.valid || validation.rows.length === 0) return;

    setImporting(true);
    setError('');
    setResults(null);

    const allResults: any[] = [];
    let errorCount = 0;

    // Group rows by category+tier+shade+structure for bulk creation
    const groups = new Map<string, CsvRow[]>();
    for (const row of validation.rows) {
      const key = `${row.category}-${row.tier}-${row.shade}-${row.structure}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(row);
    }

    for (const [, groupRows] of groups) {
      const first = groupRows[0];
      const payload: any = {
        category: first.category,
        tier: first.tier,
        shade: Number(first.shade),
        structure: first.structure,
        isListed: true,
        createStockMovement: true,
      };

      if (first.batchNumber) payload.batchNumber = first.batchNumber;
      if (first.pricePerGramCzk) payload.pricePerGramCzk = Number(first.pricePerGramCzk);

      if (groupRows.length === 1) {
        // Single SKU
        payload.lengthCm = Number(first.lengthCm);
        payload.initialGrams = Number(first.initialGrams) || 0;
        if (first.location) payload.location = first.location;
        if (first.saleMode) payload.saleMode = first.saleMode;
        if (first.weightTotalG) payload.weightTotalG = Number(first.weightTotalG);
      } else {
        // Bulk (multiple lengths)
        payload.lengths = groupRows.map(r => ({
          lengthCm: Number(r.lengthCm),
          initialGrams: Number(r.initialGrams) || 0,
          location: r.location,
        }));
      }

      try {
        const res = await fetch('/api/admin/skus/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          allResults.push(...(data.skus || []));
        } else {
          errorCount++;
          allResults.push({ error: data.error, group: `${first.tier} shade ${first.shade}` });
        }
      } catch (err: any) {
        errorCount++;
        allResults.push({ error: err.message });
      }
    }

    setResults(allResults);
    if (errorCount > 0) {
      setError(`${errorCount} skupin se nepodarilo vytvorit`);
    }
    setImporting(false);
  };

  const loadExample = () => {
    setCsvText(EXAMPLE_CSV);
    handleValidate(EXAMPLE_CSV);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Hromadny import (CSV)</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-medium mb-2">Format CSV souboru:</p>
          <p>Povinne sloupce: <code className="bg-blue-100 px-1 rounded">category, tier, shade, structure, lengthCm, initialGrams</code></p>
          <p className="mt-1">Volitelne: <code className="bg-blue-100 px-1 rounded">pricePerGramCzk, location, batchNumber, weightTotalG, saleMode</code></p>
          <p className="mt-1">Pokud neni zadana cena, pouzije se cenik (PriceMatrix).</p>
          <p className="mt-1">Radky se stejnym shade + tier + structure se automaticky seskupi do jednoho bulk vytvoreni.</p>
        </div>

        {/* File Upload */}
        <div className="flex gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition"
          >
            Nahrat CSV soubor
          </button>
          <button
            onClick={loadExample}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 transition text-sm"
          >
            Nacist priklad
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* CSV Text Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CSV data</label>
          <textarea
            value={csvText}
            onChange={(e) => {
              setCsvText(e.target.value);
              setValidation(null);
            }}
            rows={10}
            placeholder="Vloz CSV data nebo nahraj soubor..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 font-mono text-sm"
          />
        </div>

        {/* Validate Button */}
        <button
          onClick={() => handleValidate()}
          disabled={!csvText.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Validovat
        </button>

        {/* Validation Results */}
        {validation && (
          <div className={`rounded-lg p-4 border ${validation.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {validation.valid ? (
              <p className="text-green-700 font-medium">
                Validace OK - {validation.rows.length} radku pripraveno k importu
              </p>
            ) : (
              <div>
                <p className="text-red-700 font-medium mb-2">Chyby ({validation.errors.length}):</p>
                <ul className="text-sm text-red-600 space-y-1">
                  {validation.errors.slice(0, 10).map((err, i) => (
                    <li key={i}>- {err}</li>
                  ))}
                  {validation.errors.length > 10 && (
                    <li className="font-medium">... a dalsich {validation.errors.length - 10} chyb</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Preview Table */}
        {validation && validation.rows.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Nahled ({validation.rows.length} radku)</h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Category</th>
                    <th className="px-3 py-2 text-left">Tier</th>
                    <th className="px-3 py-2 text-left">Shade</th>
                    <th className="px-3 py-2 text-left">Structure</th>
                    <th className="px-3 py-2 text-left">Length</th>
                    <th className="px-3 py-2 text-left">Grams</th>
                    <th className="px-3 py-2 text-left">Price/g</th>
                    <th className="px-3 py-2 text-left">Location</th>
                    <th className="px-3 py-2 text-left">Batch</th>
                  </tr>
                </thead>
                <tbody>
                  {validation.rows.slice(0, 50).map((row, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                      <td className="px-3 py-2">{row.category}</td>
                      <td className="px-3 py-2">{row.tier}</td>
                      <td className="px-3 py-2">{row.shade}</td>
                      <td className="px-3 py-2">{row.structure}</td>
                      <td className="px-3 py-2">{row.lengthCm} cm</td>
                      <td className="px-3 py-2">{row.initialGrams}g</td>
                      <td className="px-3 py-2">{row.pricePerGramCzk || 'cenik'}</td>
                      <td className="px-3 py-2">{row.location || '-'}</td>
                      <td className="px-3 py-2">{row.batchNumber || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Import Button */}
        {validation && validation.valid && validation.rows.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleImport}
              disabled={importing}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
            >
              {importing ? 'Importuji...' : `Importovat ${validation.rows.length} SKU`}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-medium mb-2">
              Import dokoncen - vytvoreno {results.filter(r => !r.error).length} SKU
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-3 py-2 text-left">SKU kod</th>
                    <th className="px-3 py-2 text-left">ShortCode</th>
                    <th className="px-3 py-2 text-left">Delka</th>
                    <th className="px-3 py-2 text-left">Cena/g</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-t">
                      {r.error ? (
                        <td colSpan={5} className="px-3 py-2 text-red-600">
                          Chyba: {r.error} {r.group && `(${r.group})`}
                        </td>
                      ) : (
                        <>
                          <td className="px-3 py-2 font-mono text-xs">{r.code}</td>
                          <td className="px-3 py-2 font-bold text-blue-600">{r.shortCode}</td>
                          <td className="px-3 py-2">{r.lengthCm} cm</td>
                          <td className="px-3 py-2">{r.pricePerGramCzk} Kc/g</td>
                          <td className="px-3 py-2 text-green-600">OK</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
