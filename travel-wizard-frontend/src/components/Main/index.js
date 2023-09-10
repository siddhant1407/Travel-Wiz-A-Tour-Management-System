import styles from "./styles.module.css";

const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<h1> LOGGED OUT </h1>
		// <div className={styles.main_container}>
		// 	<nav className={styles.navbar}>
		// 		<button className={styles.white_btn} onClick={handleLogout}>
		// 			Logout
		// 		</button>
		// 	</nav>
		// </div>
	);
};

export default Main;
