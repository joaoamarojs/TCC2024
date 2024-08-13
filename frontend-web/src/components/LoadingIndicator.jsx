import "../styles/LoadingIndicator.css"

const LoadingIndicator = () => {
    return <div className="loading-container">
        	<div class="spinner-border spinner-border-sm text-info me-2" role="status">
			    <span class="visually-hidden">Loading...</span>
			</div>
    </div>
}

export default LoadingIndicator