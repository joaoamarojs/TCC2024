function NavSideBar(props) {

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
            <div className="sidebar-content js-simplebar" data-simplebar="init">
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
                            <a className="sidebar-user-title dropdown-toggle" href="#" data-bs-toggle="dropdown">
                                {props.name}
                            </a>
                            <div className='dropdown-menu dropdown-menu-start'>
                                <a className="dropdown-item" href="#" onClick={(e) => handleSelectPage('logout', e)}>Sair</a>
                            </div>
                            <div className="sidebar-user-subtitle">Administrativo</div>
                        </div>
                    </div>
                </div>

                <ul className="sidebar-nav">
                    <li className="sidebar-header">Paginas</li>
                    <li className="sidebar-item">
                        <a className="sidebar-link" href="#" onClick={(e) => handleSelectPage('home', e)}>
                            <i className="align-middle me-2 fas fa-fw fa-columns"></i>
                            <span className="align-middle">Dashboard</span>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a className='sidebar-link' href="#" onClick={(e) => handleSelectPage('usuarios', e)}>
                            <i className="align-middle me-2 fas fa-fw fa-users"></i>
                            <span className="align-middle">Usuarios</span>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a className='sidebar-link' href="#" onClick={(e) => handleSelectPage('clientes', e)}>
                            <i className="align-middle me-2 fas fa-fw fa-portrait"></i>
                            <span className="align-middle">Clientes</span>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a className='sidebar-link' href="#" onClick={(e) => handleSelectPage('barracas', e)}>
                            <i className="align-middle me-2 fas fa-fw fa-store"></i>
                            <span className="align-middle">Barracas</span>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a className='sidebar-link' href="#" onClick={(e) => handleSelectPage('produtos', e)}>
                            <i className="align-middle me-2 fas fa-fw fa-shopping-cart"></i>
                            <span className="align-middle">Produtos</span>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a className='sidebar-link' href="#" onClick={(e) => handleSelectPage('tipo_produto', e)}>
                            <i className="align-middle me-2 fas fa-fw fa-tags"></i>
                            <span className="align-middle">Tipos de Produtos</span>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a className='sidebar-link' href="#" onClick={(e) => handleSelectPage('festa', e)}>
                            <i className="align-middle me-2 fas fa-fw fa-briefcase"></i>
                            <span className="align-middle">Festa</span>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a className='sidebar-link' href="#" onClick={(e) => handleSelectPage('cartoes', e)}>
                            <i className="align-middle me-2 fas fa-fw fa-credit-card"></i>
                            <span className="align-middle">Cartões</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavSideBar;
