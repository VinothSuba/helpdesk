import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "../lib/auth-client.ts";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormData) {
    setError(null);

    const result = await signIn.email({
      email: data.email,
      password: data.password,
    });
    if (result.error) {
      setError(result.error.message ?? "Login failed");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Helpdesk</h1>
        <h2 style={styles.subtitle}>Sign in</h2>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              style={styles.input}
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <span style={styles.error}>{errors.email.message}</span>
            )}
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              style={styles.input}
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <span style={styles.error}>{errors.password.message}</span>
            )}
          </div>

          {error && <div style={styles.serverError}>{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            style={styles.button}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "2rem",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
  },
  title: {
    margin: "0 0 0.25rem",
    fontSize: "1.5rem",
    textAlign: "center",
  },
  subtitle: {
    margin: "0 0 1.5rem",
    fontSize: "1rem",
    fontWeight: 400,
    color: "#666",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  input: {
    padding: "0.5rem 0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "0.875rem",
    outline: "none",
  },
  error: {
    color: "#dc2626",
    fontSize: "0.75rem",
  },
  serverError: {
    color: "#dc2626",
    fontSize: "0.875rem",
    textAlign: "center",
    padding: "0.5rem",
    backgroundColor: "#fef2f2",
    borderRadius: "6px",
  },
  button: {
    padding: "0.625rem",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
  },
};
