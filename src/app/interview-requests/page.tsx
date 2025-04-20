import ScheduleFrame from "@/components/common/ScheduleFrame";
import StudentsHeader from "@/components/StudentsHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";

const InterviewRequestsPage = () => {
  const TABS = [
    { value: "month", label: "Month" },
    { value: "week", label: "Week" },
    { value: "day", label: "Day" },
  ];

  return (
    <ScheduleFrame>
      <StudentsHeader />
      <Tabs defaultValue="month">
        <TabsContent value="month">
          <Card className="rounded-l-none">
            <CardContent>
              <div className="grid grid-cols-3 items-center mb-4">
                <TabsList>
                  {TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="flex justify-center items-center gap-2">
                  <Button variant="ghost" className="rounded-full" size="icon">
                    <ChevronLeft />
                  </Button>
                  <span className="text-sm font-medium">2025년 4월</span>
                  <Button variant="ghost" className="rounded-full" size="icon">
                    <ChevronRight />
                  </Button>
                </div>
                <div></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="week">
          <Card className="rounded-l-none">
            <CardContent>
              <div className="grid grid-cols-3 items-center mb-4">
                <TabsList>
                  {TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="flex justify-center items-center gap-2">
                  <Button variant="ghost" className="rounded-full" size="icon">
                    <ChevronLeft />
                  </Button>
                  <span className="text-sm font-medium">2025년 4월</span>
                  <Button variant="ghost" className="rounded-full" size="icon">
                    <ChevronRight />
                  </Button>
                </div>
                <div></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="day">
          <Card className="rounded-l-none">
            <CardContent>
              <div className="grid grid-cols-3 items-center mb-4">
                <TabsList>
                  {TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="flex justify-center items-center gap-2">
                  <Button variant="ghost" className="rounded-full" size="icon">
                    <ChevronLeft />
                  </Button>
                  <span className="text-sm font-medium">2025년 4월</span>
                  <Button variant="ghost" className="rounded-full" size="icon">
                    <ChevronRight />
                  </Button>
                </div>
                <div></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ScheduleFrame>
  );
};

export default InterviewRequestsPage;
