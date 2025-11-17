import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCnLq0aVbjLXyJC4TgmXsb6KP7YmnRnify9fSAmqDolSMmzrM2WyX7DU-H627KxJSB0Pqq5nC4x670dHv9z5J3EmMsBb_k90XbACuL7nQsUHuGGwpQumffaIY_-yxDLWD1_j-m8StWaBmypWmdXJPBuDa1yET02bE4DHPjhylrD56kLpOIQ8ibL5kvOr30HantW-ETniu-2i0UgYixwUMm4Br6BI6W8rSaY7d9A5443FIfjjOVcBeUdXZwyOZjBqsmYgrXxf4NpLlC4')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-light via-background-light/80 to-transparent dark:from-background-dark dark:via-background-dark/80"></div>
      </div>
      <AuthForm />
    </div>
  );
}
