import { useState, type FormEvent } from 'react';

/**
 * Example target for QASkill acceptance Scenario A (spec section 75).
 *
 * Evidence the AI can extract:
 *   - email input is `required`
 *   - password has minLength={8} and maxLength={20}
 *   - a show/hide password toggle exists
 *   - the submit button is disabled while loading
 *   - a "remember me" checkbox exists
 *   - a "forgot password" link exists
 *
 * Unknown (must NOT be invented): failed-attempt policy, lock duration,
 * password complexity, post-login destination, exact error message.
 */
export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signIn({ email, password, rememberMe });
      // Destination is not defined here; do not assume where it redirects.
    } catch {
      setError('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Sign in</h1>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        required
        minLength={8}
        maxLength={20}
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="button" onClick={() => setShowPassword((value) => !value)}>
        {showPassword ? 'Hide password' : 'Show password'}
      </button>

      <label>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(event) => setRememberMe(event.target.checked)}
        />
        Remember me
      </label>

      <a href="/forgot-password">Forgot password?</a>

      {error ? <p role="alert">{error}</p> : null}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in…' : 'Login'}
      </button>
    </form>
  );
}

interface SignInParams {
  email: string;
  password: string;
  rememberMe: boolean;
}

async function signIn(params: SignInParams): Promise<void> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
}
