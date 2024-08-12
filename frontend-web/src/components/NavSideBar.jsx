function NavSideBar(props) {
    return <nav id="sidebar" className="sidebar js-sidebar">
			<div className="sidebar-content js-simplebar">
				<a className='sidebar-brand' href='index.html'>
					<span className="sidebar-brand-text align-middle">
                        <img style={{display: 'flex' ,width:'215px' }} src="/src/assets/logote.png" alt="TDM-Logo" />
					</span>
				</a>

				<div className="sidebar-user">
					<div className="d-flex justify-content-center">
						<div className="flex-shrink-0">
							<img src="/src/assets/avatar.jpg" className="avatar img-fluid rounded me-1" alt="Charles Hall" />
						</div>
						<div className="flex-grow-1 ps-2">
							<a className="sidebar-user-title dropdown-toggle" href="#" data-bs-toggle="dropdown">
								{props.name}
							</a>
							<div className="dropdown-menu dropdown-menu-start">
								<a className='dropdown-item' href=''><i className="align-middle me-1"></i> Perfil</a>
								<div className="dropdown-divider"></div>
								<a className="dropdown-item" href="/logout">Sair</a>
							</div>

							<div className="sidebar-user-subtitle">Administrativo</div>
						</div>
					</div>
				</div>

				<ul className="sidebar-nav">
					<li className="sidebar-header">
						Paginas
					</li>
					<li className="sidebar-item">
						<a className="sidebar-link" href='/'>
							<i className="align-middle" data-feather="sliders"></i> <span className="align-middle">Dashboard</span>
						</a>
					</li>

					<li className="sidebar-item">
						<a className='sidebar-link' href='/usuarios'>
							<i className="align-middle" data-feather="users"></i> <span className="align-middle">Usuarios</span>
						</a>
					</li>

					<li className="sidebar-item">
						<a className='sidebar-link' href='/clientes'>
							<i className="align-middle" data-feather="credit-card"></i> <span className="align-middle">Clientes</span>
						</a>
					</li>
				</ul>

			</div>
		</nav>
}

export default NavSideBar;
