const ContactPage = () => {
    return (
      <main style={{
          maxWidth: "900px",
          margin: "10vh auto",
          padding: "40px 20px",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.6,
          color: "#ffffff",
        }}
      >

        <h1>Contact Us</h1>

        <p>
          If you have questions about our services, policies, website, or submitted
          inquiries, please contact us using the information below.
        </p>

        <section style={{marginTop: "30px"}}>
          <h2>Business Information</h2>

          <p>
            <strong>Nasir Griffin</strong>
          </p>

          <p>
            Email: nasircrossgriffin@gmail.com
            <br />
            Phone: +1 (609) 805-9113

          </p>
        </section>

        <section style={{marginTop: "30px"}}>
          <h2>Response Times</h2>

          <p>
            We make reasonable efforts to respond to inquiries in a timely manner.
            Response times may vary depending on inquiry volume, business hours,
            holidays, and service availability.
          </p>
        </section>

        <section style={{marginTop: "30px"}}>
          <h2>Service Areas</h2>

          <p>
            New York, NY
          </p>
        </section>
      </main>
    );
  };
  
  export default ContactPage;
