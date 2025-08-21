import {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';

export default function ConditionalNavScript(): null {
  const location = useLocation();

  useEffect(() => {
    // Check if we're on an Actions SDK page
    const isActionsSDKPage = location.pathname.includes('/docs/actions-sdk/');
    
    // Add or remove the class from body
    if (isActionsSDKPage) {
      document.body.classList.add('actions-sdk-page');
    } else {
      document.body.classList.remove('actions-sdk-page');
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('actions-sdk-page');
    };
  }, [location.pathname]);

  return null; // This component doesn't render anything
}