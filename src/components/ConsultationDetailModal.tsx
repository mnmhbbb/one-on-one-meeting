import { memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InterviewInfo } from "@/utils/data/mockData";

interface ConsultationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: InterviewInfo | null;
}

const ConsultationDetailModal = ({
  isOpen,
  onClose,
  consultation,
}: ConsultationDetailModalProps) => {
  if (!consultation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>면담 상세 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">교수님</h3>
            <p>{consultation.professor}</p>
          </div>
          <div>
            <h3 className="font-semibold">학과</h3>
            <p>{consultation.department}</p>
          </div>
          <div>
            <h3 className="font-semibold">면담 일시</h3>
            <p>{new Date(consultation.date).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold">상태</h3>
            <p>{consultation.status}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>닫기</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ConsultationDetailModal);
