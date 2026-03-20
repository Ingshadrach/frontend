import React, { useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import API_BASE_URL from '../api/config';

const Reviews = () => {
  const [employerId, setEmployerId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitReview = async (e) => {
    e.preventDefault();
    if (!employerId || !comment) return alert('Fill all fields');
    try {
      await axios.post(`${API_BASE_URL}/reviews`, {
        employerId,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('konnect_token')}` }
      });
      alert('Review submitted!');
      setComment('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 className="page-header">Company Reviews</h1>
      <div className="card">
        <h3>Leave a Review</h3>
        <form onSubmit={submitReview}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Employer / Company ID</label>
            <input type="text" className="input" style={{ width: '100%' }} value={employerId} onChange={e => setEmployerId(e.target.value)} placeholder="Paste Employer ID here..." />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rating</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star} 
                  size={24} 
                  color={star <= rating ? '#F59E0B' : 'var(--border)'} 
                  fill={star <= rating ? '#F59E0B' : 'none'}
                  onClick={() => setRating(star)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Comment</label>
            <textarea className="input" rows="4" style={{ width: '100%' }} value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..."></textarea>
          </div>
          <button type="submit" className="btn">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
