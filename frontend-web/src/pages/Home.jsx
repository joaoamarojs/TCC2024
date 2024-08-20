import '../styles/Admin.css';

function Home(){

    return <div className="container-fluid p-0">
                <div className="row mb-2 mb-xl-3">
                    <div className="col-auto d-none d-sm-block">
                        <h3>Dashboard</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-6 col-xxl-5 d-flex">
                        <div className="w-100">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col mt-0">
                                                    <h5 className="card-title">Festa Atual</h5>
                                                </div>

                                                <div className="col-auto">
                                                    <div className="stat text-primary">
                                                    
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
}

export default Home