import { useEffect } from "react";

function NavTopBar() {
    useEffect(() => {
        const toggleButton = document.querySelector(".js-sidebar-toggle");
        const sidebar = document.getElementById("sidebar");

        toggleButton.addEventListener("click", () => {
            if (!sidebar.classList.contains('collapsed')) {
              sidebar.classList.add("collapsed");
            } else {
              sidebar.classList.remove("collapsed"); 
            }
        });
        return () => {};
    }, []);

    return <nav className="navbar navbar-expand navbar-light navbar-bg">
        <a className="sidebar-toggle js-sidebar-toggle">
					<i className="hamburger align-self-center"></i>
				</a>
		</nav>
}

export default NavTopBar;
