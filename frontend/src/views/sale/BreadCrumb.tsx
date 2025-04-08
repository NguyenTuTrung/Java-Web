import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

function BreadCrumb() {
  const location = useLocation(); // Get the current location object
  const params = useParams(); // Get URL params (if any)
  
  // Extract the path segments from the current URL, split by "/"
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Dynamically create breadcrumb
  const renderBreadcrumb = () => {
    return pathSegments.map((segment, index) => {
      // Construct the path for each segment
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const isLastSegment = index === pathSegments.length - 1;

      return (
        <li key={index} className="flex items-center">
          {/* If not the last segment, link to the path */}
          {!isLastSegment ? (
            <>
              <Link to={path} className="text-gray-700 hover:text-blue-600 capitalize">
                {segment.replace('-', ' ')} {/* Replace hyphen with space */}
              </Link>
              <span className="mx-2">/</span> {/* Show slash between items */}
            </>
          ) : (
            <span className="text-gray-500 capitalize">{segment.replace('-', ' ')}</span> // Last segment, just text
          )}
        </li>
      );
    });
  };

  return (
    <div className="lg:flex items-center justify-between mb-4">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {/* Home breadcrumb */}
          <li>
            <div className="flex items-center">
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Trang Chủ
              </Link>
            </div>
          </li>
          
          {/* Render dynamic breadcrumbs */}
          {renderBreadcrumb()}
        </ol>
      </nav>
    </div>
  );
}

export default BreadCrumb;
