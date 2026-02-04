"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faUser, faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import { faAddressBook, faCalendar } from '@fortawesome/free-regular-svg-icons';

export default function TestFAPage() {
  return (
    <div className="p-12">
      <h1 className="text-4xl mb-8">Test Font Awesome Icons</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl mb-4">Direct Import - Solid</h2>
          <div className="flex gap-4 text-4xl">
            <FontAwesomeIcon icon={faCoffee} />
            <FontAwesomeIcon icon={faUser} />
            <FontAwesomeIcon icon={faHeart} />
            <FontAwesomeIcon icon={faStar} />
          </div>
          <p className="text-sm mt-2">Coffee, User, Heart, Star</p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">Direct Import - Regular</h2>
          <div className="flex gap-4 text-4xl">
            <FontAwesomeIcon icon={faAddressBook} />
            <FontAwesomeIcon icon={faCalendar} />
          </div>
          <p className="text-sm mt-2">Address Book, Calendar</p>
        </section>
      </div>
    </div>
  );
}
