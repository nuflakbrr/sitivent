'use client';

import { useState, useEffect, type FC } from 'react';
import { Star, Loader2, MessageSquarePlus, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { submitTestimonial } from '@/services/testimonials';

interface ExistingTestimonial {
  id?: string;
  rating?: number;
  comment?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  registrationId: string;
  eventTitle: string;
  existingTestimonial?: ExistingTestimonial | null;
}

const TestimonialModal: FC<Props> = ({
  isOpen,
  onClose,
  registrationId,
  eventTitle,
  existingTestimonial,
}) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(existingTestimonial?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(existingTestimonial?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (existingTestimonial) {
      setRating(existingTestimonial.rating || 5);
      setComment(existingTestimonial.comment || '');
    } else {
      setRating(5);
      setComment('');
    }
  }, [existingTestimonial, isOpen]);

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error('Silakan berikan rating 1 hingga 5 bintang.');
      return;
    }

    if (!comment.trim()) {
      toast.error('Ulasan tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitTestimonial({
        registrationId,
        rating,
        comment: comment.trim(),
      });

      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['participant-registrations'] });
        onClose();
      } else {
        toast.error(res.message || 'Gagal menyimpan testimoni.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat menyimpan testimoni.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {existingTestimonial ? (
              <>
                <Edit3 className="h-5 w-5 text-indigo-600" />
                Edit Testimoni
              </>
            ) : (
              <>
                <MessageSquarePlus className="h-5 w-5 text-amber-500" />
                Beri Testimoni
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Bagikan pengalaman Anda mengikuti event{' '}
            <span className="font-semibold text-foreground">{eventTitle}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Rating Bintang */}
          <div className="space-y-2">
            <Label>Rating Event</Label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const activeStar = hoverRating ? star <= hoverRating : star <= rating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-md transition-transform hover:scale-110 focus:outline-none"
                    aria-label={`Rating ${star} bintang`}
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        activeStar
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-muted text-muted-foreground/40'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-sm font-semibold text-muted-foreground">
                {hoverRating || rating} / 5
              </span>
            </div>
          </div>

          {/* Textarea Ulasan */}
          <div className="space-y-2">
            <Label htmlFor="testimonial-comment">Ulasan / Kesan & Pesan</Label>
            <Textarea
              id="testimonial-comment"
              placeholder="Tuliskan ulasan atau kesan dan pesan Anda mengenai event ini..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Kirim Testimoni'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialModal;
