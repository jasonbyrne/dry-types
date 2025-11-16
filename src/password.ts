import { shuffleArray } from "./array";

export interface GeneratePasswordOptions {
  length?: number;
  uppercaseCount?: number;
  lowercaseCount?: number;
  numbersCount?: number;
  specialCharactersCount?: number;
}

export interface PasswordRules
  extends Exclude<GeneratePasswordOptions, "length"> {
  minLength?: number;
  maxLength?: number;
  customRules?: (password: string) => { isValid: boolean; error: string };
}

// Charsets exclude confusing characters: i, l, 1, L, o, 0, O
const UPPERCASE_CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZ";
const LOWERCASE_CHARSET = "abcdefghjkmnpqrstuvwxyz";
const NUMBERS_CHARSET = "23456789";
const SPECIAL_CHARACTERS_CHARSET = "!@#$%^&*";
const SPECIAL_CHARACTERS_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

/**
 * Generates a random password based on the provided options.
 * Confusing characters (i, l, 1, L, o, 0, O) are automatically excluded from all charsets.
 * The generated password will meet the minimum character count requirements specified.
 *
 * @param opts - Configuration options for password generation
 * @param opts.length - Desired password length (default: 12)
 * @param opts.uppercaseCount - Minimum number of uppercase letters (default: 1 if no counts specified)
 * @param opts.lowercaseCount - Minimum number of lowercase letters (default: 1 if no counts specified)
 * @param opts.numbersCount - Minimum number of numbers (default: 1 if no counts specified)
 * @param opts.specialCharactersCount - Minimum number of special characters (default: 1 if no counts specified)
 * @returns A randomly generated password string that meets all minimum requirements
 * @throws {Error} If length is less than 1, or if the sum of required counts exceeds the password length
 *
 * @example
 * ```ts
 * generatePassword({ length: 16, uppercaseCount: 2, numbersCount: 3 })
 * // Returns a 16-character password with at least 2 uppercase letters and 3 numbers
 *
 * generatePassword({ length: 8, uppercaseCount: 5, lowercaseCount: 5 })
 * // Throws error: sum of required counts (10) exceeds password length (8)
 * ```
 */
export function generatePassword(
  opts: GeneratePasswordOptions = { length: 12 }
): string {
  const {
    length = 12,
    uppercaseCount,
    lowercaseCount,
    numbersCount,
    specialCharactersCount,
  } = opts;

  if (length < 1) {
    throw new Error("Password length must be at least 1");
  }

  // Determine which character types are required
  const hasAnyCount =
    uppercaseCount !== undefined ||
    lowercaseCount !== undefined ||
    numbersCount !== undefined ||
    specialCharactersCount !== undefined;

  // If no counts specified, use defaults (at least 1 of each type)
  const requiredUppercase = uppercaseCount ?? (hasAnyCount ? 0 : 1);
  const requiredLowercase = lowercaseCount ?? (hasAnyCount ? 0 : 1);
  const requiredNumbers = numbersCount ?? (hasAnyCount ? 0 : 1);
  const requiredSpecial = specialCharactersCount ?? (hasAnyCount ? 0 : 1);

  // Validate that required counts don't exceed length
  const totalRequired =
    requiredUppercase + requiredLowercase + requiredNumbers + requiredSpecial;
  if (totalRequired > length) {
    throw new Error(
      `Sum of required character counts (${totalRequired}) exceeds password length (${length})`
    );
  }

  // Build available charsets based on what's needed
  const availableCharsets: Array<{ charset: string; count: number }> = [];
  if (requiredUppercase > 0) {
    availableCharsets.push({
      charset: UPPERCASE_CHARSET,
      count: requiredUppercase,
    });
  }
  if (requiredLowercase > 0) {
    availableCharsets.push({
      charset: LOWERCASE_CHARSET,
      count: requiredLowercase,
    });
  }
  if (requiredNumbers > 0) {
    availableCharsets.push({
      charset: NUMBERS_CHARSET,
      count: requiredNumbers,
    });
  }
  if (requiredSpecial > 0) {
    availableCharsets.push({
      charset: SPECIAL_CHARACTERS_CHARSET,
      count: requiredSpecial,
    });
  }

  // If no charsets are needed (all counts are 0), use all charsets for remaining positions
  if (availableCharsets.length === 0) {
    availableCharsets.push(
      { charset: UPPERCASE_CHARSET, count: 0 },
      { charset: LOWERCASE_CHARSET, count: 0 },
      { charset: NUMBERS_CHARSET, count: 0 },
      { charset: SPECIAL_CHARACTERS_CHARSET, count: 0 }
    );
  }

  // Build combined charset for remaining positions
  const combinedCharset = availableCharsets.map((c) => c.charset).join("");

  // Generate password by first placing required characters, then filling the rest
  const passwordChars: string[] = [];

  // Place required characters
  for (const { charset, count } of availableCharsets) {
    for (let i = 0; i < count; i++) {
      const randomChar = charset[Math.floor(Math.random() * charset.length)];
      passwordChars.push(randomChar);
    }
  }

  // Fill remaining positions with random characters from available charsets
  const remaining = length - passwordChars.length;
  for (let i = 0; i < remaining; i++) {
    const randomChar =
      combinedCharset[Math.floor(Math.random() * combinedCharset.length)];
    passwordChars.push(randomChar);
  }

  return shuffleArray(passwordChars).join("");
}

/**
 * Calculates password strength on a scale of 0-100.
 * Considers length, character variety, entropy, patterns, and common weaknesses.
 *
 * Scoring breakdown:
 * - Length: 0-30 points (longer passwords score higher with diminishing returns)
 * - Character variety: 0-25 points (uppercase, lowercase, numbers, special chars)
 * - Character distribution: 0-15 points (rewards high character diversity)
 * - Entropy: 0-20 points (based on character set size and length)
 * - Penalties: up to -20 points (for patterns, sequences, common passwords)
 *
 * @param password - The password to evaluate
 * @returns A strength score between 0 (weakest) and 100 (strongest)
 *
 * @example
 * ```ts
 * getPasswordStrength("password123") // Returns a low score
 * getPasswordStrength("MyStr0ng!P@ssw0rd") // Returns a high score
 * ```
 */
export function getPasswordStrength(password: string): number {
  if (!password || password.length === 0) {
    return 0;
  }

  const length = password.length;
  let score = 0;

  // Length scoring (0-30 points)
  // Longer passwords are exponentially better, but with diminishing returns
  if (length < 4) {
    score += length * 2; // 0-6 points
  } else if (length < 8) {
    score += 8 + (length - 4) * 3; // 8-20 points
  } else if (length < 12) {
    score += 20 + (length - 8) * 2.5; // 20-30 points
  } else {
    score += 30; // Max 30 points for length (12+ characters)
  }

  // Character variety scoring (0-25 points)
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = SPECIAL_CHARACTERS_REGEX.test(password);

  const varietyCount = [
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSpecial,
  ].filter(Boolean).length;
  score += (varietyCount / 4) * 25; // 0-25 points based on variety

  // Character distribution bonus (0-15 points)
  // Reward passwords that use multiple character types throughout
  const uniqueChars = new Set(password).size;
  const distributionRatio = uniqueChars / length;
  score += Math.min(distributionRatio * 15, 15);

  // Entropy-based scoring (0-20 points)
  // Calculate approximate entropy based on character set used
  let charsetSize = 0;
  if (hasLowercase) charsetSize += 26;
  if (hasUppercase) charsetSize += 26;
  if (hasNumbers) charsetSize += 10;
  if (hasSpecial) charsetSize += 20; // Approximate special char count

  if (charsetSize > 0) {
    const entropy = length * Math.log2(charsetSize);
    // Normalize entropy: 40+ bits is very strong, 0-20 is weak
    score += Math.min((entropy / 40) * 20, 20);
  }

  // Pattern detection penalties (subtract up to 20 points)
  let penalty = 0;

  // Check for repeated characters (e.g., "aaa", "1111")
  const repeatedPattern = /(.)\1{2,}/.test(password);
  if (repeatedPattern) {
    penalty += 5;
  }

  // Check for sequential characters (e.g., "abc", "123", "xyz")
  const sequentialPattern =
    /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(
      password
    );
  if (sequentialPattern) {
    penalty += 5;
  }

  // Check for keyboard patterns (e.g., "qwerty", "asdf")
  const keyboardPattern = /(qwerty|asdf|zxcv|qwer|asdf|zxcv|1234)/i.test(
    password
  );
  if (keyboardPattern) {
    penalty += 8;
  }

  // Check for common weak passwords
  const commonPasswords = [
    "password",
    "123456",
    "12345678",
    "qwerty",
    "abc123",
    "password1",
    "admin",
    "letmein",
    "welcome",
    "monkey",
  ];
  if (
    commonPasswords.some((common) => password.toLowerCase().includes(common))
  ) {
    penalty += 10;
  }

  // Check if password is all same character type
  const allSameType =
    (hasUppercase && !hasLowercase && !hasNumbers && !hasSpecial) ||
    (hasLowercase && !hasUppercase && !hasNumbers && !hasSpecial) ||
    (hasNumbers && !hasUppercase && !hasLowercase && !hasSpecial);
  if (allSameType && length < 12) {
    penalty += 5;
  }

  score = Math.max(0, score - penalty);

  // Length-based minimums and maximums
  // Very short passwords can't be strong
  if (length < 6) {
    score = Math.min(score, 30);
  } else if (length < 8) {
    score = Math.min(score, 50);
  }

  // Ensure score is between 0-100
  return Math.round(Math.min(Math.max(score, 0), 100));
}

/**
 * Returns a human-readable password strength level based on the strength score.
 *
 * @param password - The password to evaluate
 * @returns "weak" (0-29), "medium" (30-69), or "strong" (70-100)
 *
 * @example
 * ```ts
 * getPasswordStrengthLevel("password") // Returns "weak"
 * getPasswordStrengthLevel("MyStr0ng!P@ss") // Returns "strong"
 * ```
 */
export function getPasswordStrengthLevel(
  password: string
): "weak" | "medium" | "strong" {
  const strength = getPasswordStrength(password);
  if (strength < 30) return "weak";
  if (strength < 70) return "medium";
  return "strong";
}

/**
 * Validates a password against a set of rules.
 *
 * @param password - The password to validate
 * @param rules - Validation rules to check against
 * @param rules.minLength - Minimum password length
 * @param rules.maxLength - Maximum password length
 * @param rules.uppercaseCount - Minimum number of uppercase letters required
 * @param rules.lowercaseCount - Minimum number of lowercase letters required
 * @param rules.numbersCount - Minimum number of numbers required
 * @param rules.specialCharactersCount - Minimum number of special characters required
 * @param rules.customRules - Custom validation function that returns validation result
 * @returns An object with `isValid` boolean and `errors` array of error messages
 *
 * @example
 * ```ts
 * validatePasswordAgainstRules("MyP@ss1", {
 *   minLength: 8,
 *   uppercaseCount: 1,
 *   numbersCount: 1
 * })
 * // Returns { isValid: false, errors: ["Must be at least 8 characters long"] }
 * ```
 */
export function validatePasswordAgainstRules(
  password: string,
  rules: PasswordRules
): { isValid: boolean; errors: string[] } {
  const {
    minLength,
    maxLength,
    uppercaseCount,
    lowercaseCount,
    numbersCount,
    specialCharactersCount,
    customRules,
  } = rules;
  const errors: string[] = [];

  // Helper function to generate error message
  const mustContain = (count: number, singular: string, plural: string) => {
    if (count > 1) return `Must contain at least ${count} ${plural}`;
    return `Must contain ${singular}`;
  };

  // Basic length checks
  if (minLength !== undefined && password.length < minLength) {
    errors.push(`Must be at least ${minLength} characters long`);
  }
  if (maxLength !== undefined && password.length > maxLength) {
    errors.push(`Must be at most ${maxLength} characters long`);
  }

  // Character type checks (fixed variable shadowing bug)
  if (uppercaseCount !== undefined) {
    const actualUppercaseCount = password.match(/[A-Z]/g)?.length || 0;
    if (actualUppercaseCount < uppercaseCount) {
      errors.push(
        mustContain(uppercaseCount, "an uppercase letter", "uppercase letters")
      );
    }
  }

  if (lowercaseCount !== undefined) {
    const actualLowercaseCount = password.match(/[a-z]/g)?.length || 0;
    if (actualLowercaseCount < lowercaseCount) {
      errors.push(
        mustContain(lowercaseCount, "a lowercase letter", "lowercase letters")
      );
    }
  }

  if (numbersCount !== undefined) {
    const actualNumbersCount = password.match(/[0-9]/g)?.length || 0;
    if (actualNumbersCount < numbersCount) {
      errors.push(mustContain(numbersCount, "a number", "numbers"));
    }
  }

  if (specialCharactersCount !== undefined) {
    const actualSpecialCount =
      password.match(new RegExp(SPECIAL_CHARACTERS_REGEX.source, "g"))
        ?.length || 0;
    if (actualSpecialCount < specialCharactersCount) {
      errors.push(
        mustContain(
          specialCharactersCount,
          "a special character (!@#$%^&*)",
          "special characters (!@#$%^&*)"
        )
      );
    }
  }

  // Custom rules check
  if (customRules) {
    const { isValid, error } = customRules(password);
    if (!isValid) {
      errors.push(error);
    }
  }

  return { isValid: errors.length === 0, errors };
}
