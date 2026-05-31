export function calculateEntropy(str) {
    const freq = {}
  
    for (const char of str) {
      freq[char] = (freq[char] || 0) + 1
    }
  
    let entropy = 0
  
    for (const char in freq) {
      const p = freq[char] / str.length
      entropy -= p * Math.log2(p)
    }
  
    return entropy
  }
  
  export function findHighEntropyStrings(line) {
    const candidates = line.match(/[A-Za-z0-9_\-+/=]{24,}/g) || []
  
    return candidates.filter(value => {
      const entropy = calculateEntropy(value)
      return entropy > 4.2
    })
  }