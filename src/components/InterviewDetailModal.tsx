import { memo } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InterviewInfo } from "@/utils/data/mockData";

interface InterviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: InterviewInfo | null;
}

const InterviewDetailModal = ({ isOpen, onClose, interview }: InterviewDetailModalProps) => {
  if (!interview) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>면담 상세 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">교수님</h3>
            <p>{interview.professor}</p>
          </div>
          <div>
            <h3 className="font-semibold">학과</h3>
            <p>{interview.department}</p>
          </div>
          <div>
            <h3 className="font-semibold">면담 일시</h3>
            <p>{new Date(interview.date).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold">상태</h3>
            <p>{interview.status}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>닫기</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(InterviewDetailModal);
