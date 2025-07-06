import DynamicForm from "@/app/(roles)/(shared)/components/forms/DynamicForm";
import { formConfig } from "../configs";
export function ShipmentForm() {
  
    return <DynamicForm config={formConfig} onSubmit={() => {}}></DynamicForm>;
}
