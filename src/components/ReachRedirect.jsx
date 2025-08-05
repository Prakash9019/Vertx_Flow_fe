import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ReachRedirect = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/fundraising/preview?slug=${slug}`);
  }, [slug, navigate]);

  return <div>Redirecting...</div>;
};

export default ReachRedirect;