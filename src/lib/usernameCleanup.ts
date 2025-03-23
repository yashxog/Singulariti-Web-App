function cleanupUsername(username: string) {
    // Step 1: Trim any whitespace
    let cleaned = username.trim();
    
    // Step 2: Remove special characters and numbers from the beginning
    cleaned = cleaned.replace(/^[^a-zA-Z]+/, '');
    
    // Step 3: Get only the first word if spaces exist
    cleaned = cleaned.split(' ')[0];
    
    // Step 4: Remove special characters and numbers from the end
    cleaned = cleaned.replace(/[^a-zA-Z]+$/, '');
    
    // Step 5: Capitalize the first letter and make the rest lowercase
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
    }
    
    return cleaned;
  }

export default cleanupUsername;