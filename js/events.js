// Events Management Module
// Handles fetching and displaying events from Firebase

const EventsManager = {
  
  async getUpcomingEvents(limit = 10) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const snapshot = await db.collection('events')
        .where('date', '>=', today)
        .orderBy('date', 'asc')
        .limit(limit)
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  async getRecurringEvents() {
    try {
      const snapshot = await db.collection('recurring-events')
        .orderBy('sortOrder', 'asc')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching recurring events:', error);
      return [];
    }
  },

  renderEventCard(event) {
    const hasDetails = event.details || event.flyerUrl || event.price || event.rsvpUrl;
    const clickAttr = hasDetails ? `onclick="EventsManager.showEventModal('${event.id}')" style="cursor:pointer;"` : '';
    const accessLabels = { open: 'Open to All', guests: 'Members & Guests', members: 'Members Only' };
    const accessLabel = accessLabels[event.accessLevel] || event.tag || 'Event';
    
    return `
      <article class="card" ${clickAttr} data-event-id="${event.id}">
        <div class="card__image">
          ${event.flyerUrl 
            ? `<img src="${event.flyerUrl}" alt="${event.title}">`
            : `<div style="width:100%;height:100%;background:linear-gradient(135deg, #1a365d 0%, #2c5282 100%);display:flex;align-items:center;justify-content:center;">
                <span style="font-size:3rem;">${event.emoji || '📅'}</span>
               </div>`
          }
        </div>
        <div class="card__body">
          <span class="card__tag">${accessLabel}</span>
          <h3 class="card__title">${event.title}</h3>
          <p class="card__text">${event.description}</p>
          <p class="card__meta">${formatDateShort(event.date)}${event.time ? ' • ' + event.time : ''}</p>
          ${hasDetails ? '<p style="font-size:0.8rem;color:var(--gold-dark);margin-top:var(--space-sm);">Click for details →</p>' : ''}
        </div>
      </article>
    `;
  },

  renderRecurringEvent(event) {
    const accessLabels = { open: 'Open to All', guests: 'Members & Guests', members: 'Members Only' };
    const accessLabel = accessLabels[event.accessLevel] || (event.openToAll ? 'Open to All' : 'Members & Guests');
    const tagClass = event.accessLevel === 'open' || event.openToAll ? 'recurring-event__tag--open' : 'recurring-event__tag--members';
    const hasDetails = event.details;
    const clickAttr = hasDetails ? `onclick="EventsManager.showRecurringModal('${event.id}')" style="cursor:pointer;"` : '';
    
    return `
      <div class="recurring-event" ${clickAttr} data-event-id="${event.id}">
        <div class="recurring-event__icon">${event.emoji || '📅'}</div>
        <div class="recurring-event__content">
          <h3 class="recurring-event__title">${event.title}</h3>
          <p class="recurring-event__schedule">${event.schedule}</p>
          <p class="recurring-event__desc">${event.description}</p>
          <span class="recurring-event__tag ${tagClass}">${accessLabel}</span>
          ${hasDetails ? '<p style="font-size:0.8rem;color:var(--gold-dark);margin-top:var(--space-sm);">Click for details →</p>' : ''}
        </div>
      </div>
    `;
  },

  renderSpecialEventCard(event) {
    const hasDetails = event.details || event.flyerUrl || event.price || event.rsvpUrl;
    const clickAttr = hasDetails ? `onclick="EventsManager.showEventModal('${event.id}')" style="cursor:pointer;"` : '';
    const accessLabels = { open: 'Open to All', guests: 'Members & Guests', members: 'Members Only' };
    const accessLabel = accessLabels[event.accessLevel] || event.tag || 'Event';
    
    return `
      <article class="card" ${clickAttr} data-event-id="${event.id}">
        <div class="card__image">
          ${event.flyerUrl 
            ? `<img src="${event.flyerUrl}" alt="${event.title}">`
            : `<div style="width:100%;height:100%;background:linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);display:flex;align-items:center;justify-content:center;">
                <span style="font-size:4rem;">${event.emoji || '📅'}</span>
               </div>`
          }
        </div>
        <div class="card__body">
          <span class="card__tag">${accessLabel}</span>
          <h3 class="card__title">${event.title}</h3>
          <p class="card__text">${event.description}</p>
          <p class="card__meta">${formatDateShort(event.date)}${event.time ? ' • ' + event.time : ''}</p>
          ${hasDetails ? '<p style="font-size:0.8rem;color:var(--gold-dark);margin-top:var(--space-sm);">Click for details →</p>' : ''}
        </div>
      </article>
    `;
  },

  async showEventModal(eventId) {
    try {
      const doc = await db.collection('events').doc(eventId).get();
      if (!doc.exists) return;
      
      const event = doc.data();
      
      let modal = document.getElementById('event-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'event-modal';
        modal.innerHTML = `
          <div class="event-modal__backdrop" onclick="EventsManager.closeEventModal()"></div>
          <div class="event-modal__content">
            <button class="event-modal__close" onclick="EventsManager.closeEventModal()">&times;</button>
            <div class="event-modal__body"></div>
          </div>
        `;
        document.body.appendChild(modal);
        
        const style = document.createElement('style');
        style.textContent = `
          #event-modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; }
          #event-modal.active { display: flex; align-items: center; justify-content: center; padding: 1rem; }
          .event-modal__backdrop { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); }
          .event-modal__content { position: relative; background: white; border-radius: 12px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; }
          .event-modal__close { position: absolute; top: 0.5rem; right: 1rem; background: none; border: none; font-size: 2rem; cursor: pointer; color: #718096; z-index: 1; line-height: 1; }
          .event-modal__close:hover { color: #1a365d; }
          .event-modal__body { padding: 2rem; }
          .event-modal__flyer { width: 100%; border-radius: 8px; margin-bottom: 1.5rem; }
          .event-modal__title { font-size: 1.5rem; margin-bottom: 0.5rem; color: #1a365d; }
          .event-modal__meta { color: #718096; margin-bottom: 1rem; }
          .event-modal__tag { display: inline-block; background: #1a365d; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.875rem; margin-bottom: 1rem; }
          .event-modal__price { font-size: 1.25rem; font-weight: 600; color: #b7791f; margin-bottom: 1rem; }
          .event-modal__description { margin-bottom: 1rem; line-height: 1.6; }
          .event-modal__details { background: #f7fafc; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; white-space: pre-line; line-height: 1.6; }
          .event-modal__rsvp { display: inline-block; background: #d69e2e; color: #1a365d; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; text-decoration: none; }
          .event-modal__rsvp:hover { background: #b7791f; color: white; }
        `;
        document.head.appendChild(style);
      }
      
      const accessLabels = { open: 'Open to All', guests: 'Members & Guests', members: 'Members Only' };
      const accessLabel = accessLabels[event.accessLevel] || event.tag || 'Event';
      const body = modal.querySelector('.event-modal__body');
      body.innerHTML = `
        ${event.flyerUrl ? `<img src="${event.flyerUrl}" alt="${event.title}" class="event-modal__flyer">` : ''}
        <span class="event-modal__tag">${accessLabel}</span>
        <h2 class="event-modal__title">${event.emoji || '📅'} ${event.title}</h2>
        <p class="event-modal__meta">${formatDate(event.date)}${event.time ? ' • ' + event.time : ''}</p>
        ${event.price ? `<p class="event-modal__price">${event.price}</p>` : ''}
        <p class="event-modal__description">${event.description}</p>
        ${event.details ? `<div class="event-modal__details">${event.details}</div>` : ''}
        ${event.rsvpUrl ? `<a href="${event.rsvpUrl}" target="_blank" rel="noopener" class="event-modal__rsvp">RSVP / Get Tickets</a>` : ''}
      `;
      
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } catch (error) {
      console.error('Error loading event details:', error);
    }
  },

  closeEventModal() {
    const modal = document.getElementById('event-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  async showRecurringModal(eventId) {
    try {
      const doc = await db.collection('recurring-events').doc(eventId).get();
      if (!doc.exists) return;
      
      const event = doc.data();
      
      let modal = document.getElementById('event-modal');
      if (!modal) {
        // Create modal if it doesn't exist (same structure as regular events)
        modal = document.createElement('div');
        modal.id = 'event-modal';
        modal.innerHTML = `
          <div class="event-modal__backdrop" onclick="EventsManager.closeEventModal()"></div>
          <div class="event-modal__content">
            <button class="event-modal__close" onclick="EventsManager.closeEventModal()">&times;</button>
            <div class="event-modal__body"></div>
          </div>
        `;
        document.body.appendChild(modal);
        
        const style = document.createElement('style');
        style.textContent = `
          #event-modal { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; }
          #event-modal.active { display: flex; align-items: center; justify-content: center; padding: 1rem; }
          .event-modal__backdrop { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); }
          .event-modal__content { position: relative; background: white; border-radius: 12px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; }
          .event-modal__close { position: absolute; top: 0.5rem; right: 1rem; background: none; border: none; font-size: 2rem; cursor: pointer; color: #718096; z-index: 1; line-height: 1; }
          .event-modal__close:hover { color: #1a365d; }
          .event-modal__body { padding: 2rem; }
          .event-modal__flyer { width: 100%; border-radius: 8px; margin-bottom: 1.5rem; }
          .event-modal__title { font-size: 1.5rem; margin-bottom: 0.5rem; color: #1a365d; }
          .event-modal__meta { color: #718096; margin-bottom: 1rem; }
          .event-modal__tag { display: inline-block; background: #1a365d; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.875rem; margin-bottom: 1rem; }
          .event-modal__price { font-size: 1.25rem; font-weight: 600; color: #b7791f; margin-bottom: 1rem; }
          .event-modal__description { margin-bottom: 1rem; line-height: 1.6; }
          .event-modal__details { background: #f7fafc; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; white-space: pre-line; line-height: 1.6; }
          .event-modal__rsvp { display: inline-block; background: #d69e2e; color: #1a365d; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; text-decoration: none; }
          .event-modal__rsvp:hover { background: #b7791f; color: white; }
        `;
        document.head.appendChild(style);
      }
      
      const accessLabels = { open: 'Open to All', guests: 'Members & Guests', members: 'Members Only' };
      const accessLabel = accessLabels[event.accessLevel] || (event.openToAll ? 'Open to All' : 'Members & Guests');
      const body = modal.querySelector('.event-modal__body');
      body.innerHTML = `
        <span class="event-modal__tag">${accessLabel}</span>
        <h2 class="event-modal__title">${event.emoji || '📅'} ${event.title}</h2>
        <p class="event-modal__meta">${event.schedule}</p>
        <p class="event-modal__description">${event.description}</p>
        ${event.details ? `<div class="event-modal__details">${event.details}</div>` : ''}
      `;
      
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } catch (error) {
      console.error('Error loading recurring event details:', error);
    }
  },

  async loadHomepageEvents(containerId, limit = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '<p class="text-center">Loading events...</p>';
    const events = await this.getUpcomingEvents(limit);
    
    if (events.length === 0) {
      container.innerHTML = '<p class="text-center" style="color: var(--gray-500);">No upcoming events. Check back soon!</p>';
      return;
    }

    container.innerHTML = events.map(event => this.renderEventCard(event)).join('');
  },

  async loadEventsPage(recurringContainerId, upcomingContainerId) {
    const recurringContainer = document.getElementById(recurringContainerId);
    if (recurringContainer) {
      const recurringEvents = await this.getRecurringEvents();
      if (recurringEvents.length > 0) {
        recurringContainer.innerHTML = recurringEvents.map(event => this.renderRecurringEvent(event)).join('');
      }
    }

    const upcomingContainer = document.getElementById(upcomingContainerId);
    if (upcomingContainer) {
      upcomingContainer.innerHTML = '<p class="text-center">Loading events...</p>';
      const events = await this.getUpcomingEvents(6);
      
      if (events.length === 0) {
        upcomingContainer.innerHTML = '<p class="text-center" style="color: var(--gray-500);">No upcoming special events scheduled. Check back soon!</p>';
        return;
      }

      upcomingContainer.innerHTML = events.map(event => this.renderSpecialEventCard(event)).join('');
    }
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') EventsManager.closeEventModal();
});
