const rpRegex = /rp\s*(\d+(\.\d{3})*(\.\d{1,2})?)/gi;

export function extractAmount(text: string): number | null {
  const matches = text.match(rpRegex);

  // Extract the captured amounts from the matches
  const amount = matches
    ? matches
        .filter((match) => match !== null)
        .map((match) => match.replace(/rp/i, '').replace(/\s|\./g, ''))
        .join('')
    : null;

  return amount ? Number(amount) : null;
}
