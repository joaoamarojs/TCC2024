import "../styles/LoadingIndicator.css"

const LoadingIndicator = () => {
    return <div className="loading-container">
        	<div className="spinner-border spinner-border-sm text-info me-2" role="status">
			    <span className="visually-hidden">Loading...</span>
			</div>
    </div>
}

export default LoadingIndicator