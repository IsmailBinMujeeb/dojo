import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PanelWrapper from "@/components/panel-wrapper";
import { Protected } from "@/components/Protected";
import { Wrench } from "lucide-react";

const DojoAI = () => {
  return (
    <Protected>
      <PanelWrapper>
        <div className="p-4">
          <Alert>
            <Wrench />
            <AlertTitle>We are working on it!</AlertTitle>
            <AlertDescription>
              AI system is under development. We are working hard to provide you
              with the best experience possible. Please check back soon for
              updates.
            </AlertDescription>
          </Alert>
        </div>
      </PanelWrapper>
    </Protected>
  );
};

export default DojoAI;
