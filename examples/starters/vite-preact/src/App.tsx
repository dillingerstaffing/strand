import "@dillingerstaffing/strand/css/reset.css";
import "@dillingerstaffing/strand/css/tokens.css";
import "@dillingerstaffing/strand/css/base.css";
import "@dillingerstaffing/strand-ui/css/strand-ui.css";
import "./app.css";

import { useState } from "preact/hooks";
import {
	Container,
	Section,
	Stack,
	Card,
	Button,
	Input,
	FormField,
} from "@dillingerstaffing/strand-ui";

export function App() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	return (
		<Section>
			<Container width="narrow">
				<Stack gap={8}>
					<Stack gap={2}>
						<h1>Get Started with Strand</h1>
						<p>A quick sign-up form built with Strand components.</p>
					</Stack>

					<Card variant="elevated" padding="lg">
						<form onSubmit={(e) => e.preventDefault()}>
							<Stack gap={6}>
								<FormField label="Full name" required>
									<Input
										placeholder="Jane Smith"
										value={name}
										onInput={(e) =>
											setName(
												(e.target as HTMLInputElement)
													.value,
											)
										}
									/>
								</FormField>

								<FormField label="Email address" required>
									<Input
										type="email"
										placeholder="jane@example.com"
										value={email}
										onInput={(e) =>
											setEmail(
												(e.target as HTMLInputElement)
													.value,
											)
										}
									/>
								</FormField>

								<Button>Create account</Button>
							</Stack>
						</form>
					</Card>
				</Stack>
			</Container>
		</Section>
	);
}
