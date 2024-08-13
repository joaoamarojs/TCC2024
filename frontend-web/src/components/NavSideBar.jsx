import { useEffect, useState, useRef } from "react";

function NavSideBar(props) {

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectPage = (page, event) => {
        event.preventDefault();
        if (props.onSelectPage) {
            props.onSelectPage(page);
        }

        const sidebarItems = document.querySelectorAll(".sidebar-item");
        sidebarItems.forEach((item) => {
            item.classList.remove("active");
        });

        const clickedItem = event.currentTarget.closest(".sidebar-item");
        if (clickedItem) {
            clickedItem.classList.add("active");
        }
    };

    return (
        <nav id="sidebar" className="sidebar js-sidebar">
            <div className="sidebar-content js-simplebar">
                <a className='sidebar-brand' href='index.html'>
                    <span className="sidebar-brand-text align-middle">
                        <img style={{ display: 'flex', width: '215px' }} src="/img/logote.png" alt="TDM-Logo" />
                    </span>
                </a>

                <div className="sidebar-user">
                    <div className="d-flex justify-content-center">
                        <div className="flex-shrink-0">
                            <img src="/img/avatar.jpg" className="avatar img-fluid rounded me-1" alt="Charles Hall" />
                        </div>
                        <div className="flex-grow-1 ps-2">
                            <a className="sidebar-user-title dropdown-toggle" onClick={toggleDropdown} href="#" data-bs-toggle="dropdown">
                                {props.name}
                            </a>
                            <div className={`dropdown-menu dropdown-menu-start ${isDropdownOpen ? 'show' : ''}`}>
                                <a className='dropdown-item' href=''><i className="align-middle me-1"></i> Perfil</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="logout">Sair</a>
                            </div>
                            <div className="sidebar-user-subtitle">Administrativo</div>
                        </div>
                    </div>
                </div>

                <ul className="sidebar-nav">
                    <li className="sidebar-header">Paginas</li>
                    <li className="sidebar-item">
                        <a className="sidebar-link" href="#" onClick={(e) => handleSelectPage('home', e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-airplay align-middle me-2">
                                <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
                                <polygon points="12 15 17 21 7 21 12 15"></polygon>
                            </svg>
                            <span className="align-middle">Dashboard</span>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a className='sidebar-link' href="#" onClick={(e) => handleSelectPage('usuarios', e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user align-middle">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span className="align-middle">Usuarios</span>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a className='sidebar-link' href="#" onClick={(e) => handleSelectPage('clientes', e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users align-middle">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span className="align-middle">Clientes</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavSideBar;
