// Hall Inquiries Management Module
// Handles saving and retrieving hall rental inquiries from Firebase

const HallInquiries = {

  // Submit a new hall inquiry
  async submitInquiry(formData) {
    try {
      const docRef = await db.collection('hall-inquiries').add({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        eventDate: formData.eventDate || '',
        eventType: formData.eventType || '',
        guestCount: formData.guestCount || '',
        message: formData.message || '',
        status: 'new',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all inquiries (for admin)
  async getAllInquiries() {
    try {
      const snapshot = await db.collection('hall-inquiries')
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      return [];
    }
  },

  // Get new/unread inquiries (for admin)
  async getNewInquiries() {
    try {
      const snapshot = await db.collection('hall-inquiries')
        .where('status', '==', 'new')
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching new inquiries:', error);
      return [];
    }
  },

  // Update inquiry status
  async updateStatus(inquiryId, status) {
    try {
      await db.collection('hall-inquiries').doc(inquiryId).update({
        status: status,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete inquiry
  async deleteInquiry(inquiryId) {
    try {
      await db.collection('hall-inquiries').doc(inquiryId).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      return { success: false, error: error.message };
    }
  },

  // Initialize form handler
  initFormHandler(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      const formData = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        phone: form.querySelector('#phone')?.value || '',
        eventDate: form.querySelector('#event-date')?.value || '',
        eventType: form.querySelector('#event-type')?.value || '',
        guestCount: form.querySelector('#guests')?.value || '',
        message: form.querySelector('#message')?.value || ''
      };

      const result = await this.submitInquiry(formData);

      if (result.success) {
        // Show success message
        form.innerHTML = `
          <div style="text-align: center; padding: var(--space-2xl);">
            <div style="font-size: 3rem; margin-bottom: var(--space-md);">✅</div>
            <h3 style="margin-bottom: var(--space-md);">Thank You!</h3>
            <p style="color: var(--gray-600);">We've received your inquiry and will get back to you within 24 hours.</p>
          </div>
        `;
      } else {
        // Show error message
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        alert('There was an error submitting your inquiry. Please try again or call us directly at (908) 232-9667.');
      }
    });
  }
};

// Contact form handler (similar to hall inquiries)
const ContactForm = {

  async submitContact(formData) {
    try {
      const docRef = await db.collection('contact-messages').add({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
        status: 'new',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      return { success: false, error: error.message };
    }
  },

  initFormHandler(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      const formData = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        phone: form.querySelector('#phone')?.value || '',
        subject: form.querySelector('#subject')?.value || '',
        message: form.querySelector('#message').value
      };

      const result = await this.submitContact(formData);

      if (result.success) {
        form.innerHTML = `
          <div style="text-align: center; padding: var(--space-2xl);">
            <div style="font-size: 3rem; margin-bottom: var(--space-md);">✅</div>
            <h3 style="margin-bottom: var(--space-md);">Message Sent!</h3>
            <p style="color: var(--gray-600);">Thank you for reaching out. We'll get back to you soon.</p>
          </div>
        `;
      } else {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        alert('There was an error sending your message. Please try again or call us directly at (908) 232-9667.');
      }
    });
  }
};
