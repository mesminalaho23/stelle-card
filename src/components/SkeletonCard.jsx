import './SkeletonCard.css';

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-img skeleton-pulse" />
    <div className="skeleton-body">
      <div className="skeleton-line skeleton-line--title skeleton-pulse" />
      <div className="skeleton-line skeleton-line--sub skeleton-pulse" />
      <div className="skeleton-row">
        <div className="skeleton-line skeleton-line--sm skeleton-pulse" />
        <div className="skeleton-line skeleton-line--sm skeleton-pulse" />
      </div>
      <div className="skeleton-row">
        <div className="skeleton-line skeleton-line--price skeleton-pulse" />
        <div className="skeleton-line skeleton-line--btn skeleton-pulse" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
