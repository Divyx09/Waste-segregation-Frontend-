
import "../assets/scss/style.scss";
const ListingCard = ({ data }) => (
  <>
    {
      console.log(data)
    }
    <div className="listing-card">
      <div className="card-header">
        <span className={`category-badge ${data?.category}`}>
          {data?.category?.toUpperCase()}
        </span>
      </div>
      <div className="card-body">
        <h3>{data?.title}</h3>
        <p className="location">
          <span className="location-icon"></span> {data?.location}
        </p>
        <div className="details">
          <div className="detail-item">
            
          </div>
          <div className="detail-item"><span className="detail-label">Quantity</span>
            <strong className="detail-value">{data?.quantity}</strong>
            <span className="detail-label">Price</span>
            <strong className="detail-value">{data?.price}</strong>
          </div>
          <div className="detail-item">
            <span className="detail-label">Purity</span>
            <div className="purity-meter">
              <div
                className="purity-fill"
                style={{ width: `${data?.purity}%` }}
              ></div>
              <strong className="detail-value">{data?.purity}%</strong>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <button className="btn border border-1 btn-light px-2 rounded-2">
          <span className="btn-icon"></span> Details
        </button>
        <button className="btn-danger p-2 rounded-2 border-0">
          <span className="btn-icon"></span> Contact
        </button>
      </div>
      <div className="card-date">Posted: {data?.date}</div>
    </div>
  </>
);
export default ListingCard;