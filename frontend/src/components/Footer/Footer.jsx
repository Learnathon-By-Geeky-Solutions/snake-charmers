function Footer() {
  return (
    <div>
      <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content p-10">
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover" href="/services/branding">Branding</a>
          <a className="link link-hover" href="/services/design">Design</a>
          <a className="link link-hover" href="/services/marketing">Marketing</a>
          <a className="link link-hover" href="/services/advertisement">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover" href="/company/about">About us</a>
          <a className="link link-hover" href="/company/contact">Contact</a>
          <a className="link link-hover" href="/company/jobs">Jobs</a>
          <a className="link link-hover" href="/company/press-kit">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover" href="/legal/terms">Terms of use</a>
          <a className="link link-hover" href="/legal/privacy">Privacy policy</a>
          <a className="link link-hover" href="/legal/cookies">Cookie policy</a>
        </nav>
      </footer>
    </div>
  )
}

export default Footer