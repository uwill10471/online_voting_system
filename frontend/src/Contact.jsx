import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-5">
      <div className="container max-w-3xl p-8 bg-white shadow rounded-lg">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Contact Us</h2>
        <form className="space-y-8">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                className="form-control shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@example.com"
                className="form-control shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="form-group mt-3">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Subject"
              className="form-control shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              placeholder="Your message..."
              className="form-control shadow-sm focus:ring-primary focus:border-primary"
            ></textarea>
          </div>

          <div className="text-center mt-5">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 btn btn-primary hover:bg-primary-dark rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
