import { useAuth } from "../AuthContext";



export default function RegisterPage() {
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            await register(email, password);
        }
        catch (err) {
            alert("Något gick fel" + err);
        }
    }

    return (
        <div>
            <h2>Registrera</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" required />
                </div>
                <div>
                    <label>Lösenord:</label>
                    <input type="password" name="password" required />
                </div>
                <button type="submit">Registrera</button>
            </form>
        </div>

    );
}
