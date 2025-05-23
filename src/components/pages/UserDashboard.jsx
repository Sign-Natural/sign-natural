import React, { useState } from 'react';
import DashboardLayout from '../dashboardUi/DashboardLayout';
import CourseGrid from '../dashboardUi/CourseGrid';
import BookingGrid from '../dashboardUi/BookingGrid';
import UserProfile from '../dashboardUi/UserProfile';
import StoryForm from '../dashboardUi/StoryForm';
import Testimonials from '../dashboardUi/Testimonials';
import TutorialGrid from '../dashboardUi/TutorialGrid';
import News from '../dashboardUi/News';
import UpdateProfileForm from '../dashboardUi/UpdateProfileForm';
import Bill from '../dashboardUi/Bill';



const dummyTutorials = [
  {
    id: 1,
    title: 'How to Make Herbal Soap',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'A beginner-friendly tutorial on herbal soap making.',
  },
  {
    id: 2,
    title: 'Natural Skincare Tips',
    url: 'https://www.w3schools.com/html/movie.mp4',
    description: 'Learn natural skincare routines.',
  },
  {
    id: 3,
    title: 'DIY Organic Shampoo',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
    description: 'Make your own organic shampoo at home.',
  },
];

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('Free Tutorials');

  const tabs = [
     'User Profile',
    'Free Tutorials',
    'My Learning',
    'Post a Story',
    'Testimonials',
    'Purchase',
    
  ];

  
  const dummyPayments =[
    {id:1,item:'Workshop Ticket',amount:'GH 50',date:'2024-12-10',status:'Paid'},
    {id:2,item:'Class ',ampout:'GH 120',date:'2025-01-15',status:'paid'}
  ];

   const dummyTestimonials=[
    {id:1,
      name:'Ama Serwar',
    message:'This course change my life! I now make and sell my own skincare products.',date:'2024-11-10',},
    {
      id:2,
      name:'Kwame Nkrumah',
      message:'Fantastic teaching.Highly recommended!',
      date:'2024-12-01',
    },
   ];


  return (
    <DashboardLayout>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white  shadow-md p-4 space-y-2">
          <h2 className="text-lg font-bold mb-4 text-gray-800">My Dashboard</h2>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium ${
                activeTab === tab ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <h1 className="text-2xl font-semibold mb-4">{activeTab}</h1>

          {activeTab === 'Free Tutorials' && <TutorialGrid tutorials={dummyTutorials} />}
          {activeTab === 'My Learning' && (
            <>
              <h3 className="font-semibold mb-2">Available Courses</h3>
              <CourseGrid />
              <h3 className="font-semibold mt-6 mb-2">Your Bookings</h3>
              <BookingGrid />
            </>
          )}
          {activeTab === 'User Profile' && <UserProfile />}
          {activeTab === 'Post a Story' && <StoryForm />}
          {activeTab === 'Testimonials' && <Testimonials testimonials={dummyTestimonials} />}
          {activeTab === 'Purchase' && <Bill payments={dummyPayments}  />}
          
          
        </main>
      </div>
    </DashboardLayout>
  );
}
