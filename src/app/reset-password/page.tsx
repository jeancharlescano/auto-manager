import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
	return (
		<Suspense
			fallback={
				<div className="w-full min-h-[calc(100vh-64px)] px-4 sm:px-8 md:px-12 py-6 flex items-start lg:items-center justify-center">
					<div className="w-full max-w-md bg-secBackground rounded p-4 sm:p-6 shadow-lg flex flex-col">
						<p className="text-sm text-foreground text-center">Chargement...</p>
					</div>
				</div>
			}
		>
			<ResetPasswordForm />
		</Suspense>
	);
}
