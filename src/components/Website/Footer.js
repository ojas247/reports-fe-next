import Link from 'next/link';

function Footer() {
    return (
        <div
          id="footer-container"
          className="flex w-full flex-wrap items-start bg-[rgb(244,245,255)] p-2 sm:flex-row sm:items-center sm:justify-start"
        >
          <div className="m-1 pl-1 text-center text-black sm:text-left">
            <small>MarketReports by Synthesis | Copyright ©2024</small>
          </div>
    
          <div className="m-1 pl-1 text-center sm:text-left">
            <small>
              <Link className="no-underline text-black" href="/Policies/TandC">Terms & Conditions</Link>
            </small>
          </div>
    
          <div className="m-1 pl-1 text-center sm:text-left">
            <small>
              <Link className="no-underline text-black" href="/Policies/RefundPolicy">Refund Policy</Link>
            </small>
          </div>
    
          <div className="m-1 pl-1 text-left">
            <small>
              <Link className="no-underline text-black" href="/Policies/ContactUs">ContactUs</Link>
            </small>
          </div>
    
          <div className="m-1 pl-1 text-left">
            <small>
              <Link className="no-underline text-black" href="/Policies/Privacy">Privacy</Link>
            </small>
          </div>
        </div>
      );
}

export default Footer;