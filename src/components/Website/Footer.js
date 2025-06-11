

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
              <a className="no-underline text-black" href="/TandC">Terms & Conditions</a>
            </small>
          </div>
    
          <div className="m-1 pl-1 text-center sm:text-left">
            <small>
              <a className="no-underline text-black" href="/RefundPolicy">Refund Policy</a>
            </small>
          </div>
    
          <div className="m-1 pl-1 text-left">
            <small>
              <a className="no-underline text-black" href="/ContactUs">ContactUs</a>
            </small>
          </div>
    
          <div className="m-1 pl-1 text-left">
            <small>
              <a className="no-underline text-black" href="/Privacy">Privacy</a>
            </small>
          </div>
        </div>
      );
}

export default Footer;