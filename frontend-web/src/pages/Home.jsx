import NavSideBar from "../components/NavSideBar";
import NavTopBar from "../components/NavTopBar";
import useUserData from '../hooks/useUserData';
import '../styles/Admin.css';
import '/src/assets/app.js';

function Home(){
    const { user, loading, error } = useUserData();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return <div className="wrapper">
                <NavSideBar name={user.username}/>
                <div className="main">
                    <NavTopBar />
                    <main className="content">
                        <div className="container-fluid p-0">
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
                    </main>    
                </div>
            </div>;
}

export default Home