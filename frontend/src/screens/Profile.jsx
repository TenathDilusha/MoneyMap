import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
	const [user, setUser] = useState(null);
	const [showConfirm, setShowConfirm] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const stored = localStorage.getItem("user");
		if (stored) setUser(JSON.parse(stored));
	}, []);

const confirmLogout = async () => {
    try {
      await import("axios").then(({ default: axios }) =>
        axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true })
      );
    } catch (_) {}
		localStorage.removeItem("user");
		navigate("/login");
	};

	return (
		<div className="page-container">
			<div className="page-header">
				<h1 className="page-title">Profile</h1>
				<p className="page-subtitle">User profile and settings</p>
			</div>
			<div className="card" style={{ maxWidth: 400, margin: "0 auto", padding: 32 }}>
				<div style={{ textAlign: "center", marginBottom: 24 }}>
					<div style={{ fontSize: 48, marginBottom: 8 }}>👤</div>
					<div style={{ fontWeight: 700, fontSize: 18 }}>
						{user ? user.username : "-"}
					</div>
					<div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
						{user ? user.email : "-"}
					</div>
				</div>
				<div style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", marginBottom: 20 }}>
					{user ? "Welcome to your profile!" : "No user data found."}
				</div>
				<button
					onClick={() => setShowConfirm(true)}
					style={{
						width: "100%",
						marginTop: 12,
						padding: "12px",
						background: "rgba(255, 77, 109, 0.12)",
						color: "var(--accent-red)",
						border: "1px solid rgba(255, 77, 109, 0.35)",
						borderRadius: "var(--radius-sm)",
						fontWeight: 600,
						fontSize: 14,
						cursor: "pointer",
						transition: "background 0.2s",
					}}
					onMouseOver={e => e.currentTarget.style.background = "rgba(255, 77, 109, 0.22)"}
					onMouseOut={e => e.currentTarget.style.background = "rgba(255, 77, 109, 0.12)"}
				>
					Logout
				</button>
			</div>

			{/* Custom Confirm Dialog */}
			{showConfirm && (
				<div style={{
					position: "fixed", inset: 0,
					background: "rgba(0,0,0,0.6)",
					backdropFilter: "blur(4px)",
					display: "flex", alignItems: "center", justifyContent: "center",
					zIndex: 1000,
				}}>
					<div style={{
						background: "var(--bg-card)",
						border: "1px solid var(--border)",
						borderRadius: "var(--radius)",
						padding: "32px 28px",
						maxWidth: 360,
						width: "90%",
						boxShadow: "var(--shadow)",
					}}>
						<div style={{ fontSize: 36, textAlign: "center", marginBottom: 12 }}>🚪</div>
						<h3 style={{ color: "var(--text-primary)", fontSize: 17, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>
							Log out?
						</h3>
						<p style={{ color: "var(--text-secondary)", fontSize: 13, textAlign: "center", marginBottom: 24 }}>
							Are you sure you want to log out of your account?
						</p>
						<div style={{ display: "flex", gap: 10 }}>
							<button
								onClick={() => setShowConfirm(false)}
								style={{
									flex: 1, padding: "11px",
									background: "var(--bg-secondary)",
									color: "var(--text-primary)",
									border: "1px solid var(--border)",
									borderRadius: "var(--radius-sm)",
									fontWeight: 600, fontSize: 14,
									cursor: "pointer",
								}}
								onMouseOver={e => e.currentTarget.style.background = "var(--bg-card-hover)"}
								onMouseOut={e => e.currentTarget.style.background = "var(--bg-secondary)"}
							>
								Cancel
							</button>
							<button
								onClick={confirmLogout}
								style={{
									flex: 1, padding: "11px",
									background: "rgba(255, 77, 109, 0.15)",
									color: "var(--accent-red)",
									border: "1px solid rgba(255, 77, 109, 0.4)",
									borderRadius: "var(--radius-sm)",
									fontWeight: 600, fontSize: 14,
									cursor: "pointer",
								}}
								onMouseOver={e => e.currentTarget.style.background = "rgba(255, 77, 109, 0.28)"}
								onMouseOut={e => e.currentTarget.style.background = "rgba(255, 77, 109, 0.15)"}
							>
								Yes, log out
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
