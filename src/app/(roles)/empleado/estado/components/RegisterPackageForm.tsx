import DynamicForm from '@/app/(roles)/(shared)/components/forms/DynamicForm';
import { formConfig } from '../configs';

export function RegisterPackageForm() {

  return (
    <DynamicForm config={formConfig} onSubmit={()=>{}}></DynamicForm>
  )
}



