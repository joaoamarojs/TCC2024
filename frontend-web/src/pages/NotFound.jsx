function NotFound(){
    return <main className="d-flex w-100 h-100">
            <div className="container d-flex flex-column">
                <div className="row vh-100">
                    <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto d-table h-100">
                        <div className="d-table-cell align-middle">

                            <div className="text-center">
                                <h1 className="display-1 fw-bold">404</h1>
                                <p className="h2">Pagina Não Encontrada.</p>
                                <p className="lead fw-normal mt-3 mb-4">A pagina que você procura não existe ou foi removida.</p>
                                <a className='btn btn-primary btn-lg' href='/'>Voltar</a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
}

export default NotFound