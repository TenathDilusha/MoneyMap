export default function Profile() {
	return (
		<div className="page-container">
			<div className="page-header">
				<h1 className="page-title">Profile</h1>
				<p className="page-subtitle">User profile and settings (demo)</p>
			</div>
			<div className="card" style={{ maxWidth: 400, margin: '0 auto', padding: 32 }}>
				<div style={{ textAlign: 'center', marginBottom: 24 }}>
					<div style={{ fontSize: 48, marginBottom: 8 }}>👤</div>
					<div style={{ fontWeight: 700, fontSize: 18 }}>Demo User</div>
					<div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>user@email.com</div>
				</div>
				<div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
					This is a demo profile page. You can extend this with real user data, settings, or authentication.
				</div>
			</div>
		</div>
	);
}
