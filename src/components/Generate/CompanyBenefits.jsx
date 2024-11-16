// import React, { useEffect } from 'react';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Trash, Plus } from 'lucide-react';
// import { useForm, useFieldArray } from "react-hook-form";

// const CompanyBenefits = ({ defaultValues, onChange }) => {
//   const { control, watch } = useForm({
//     defaultValues: {
//       benefitDetails: defaultValues || [
//         { benefitId: null, description: "" }
//       ]
//     }
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "benefitDetails"
//   });

//   // Watch for changes and notify parent
//   const benefits = watch("benefitDetails");
//   useEffect(() => {
//     onChange?.(benefits);
//   }, [benefits, onChange]);

//   const addBenefit = () => {
//     if (fields.length < 3) {
//       append({ benefitId: null, description: "" });
//     }
//   };

//   const removeBenefit = (index) => {
//     if (fields.length > 1) {
//       remove(index);
//     }
//   };

//   const handleBenefitChange = (index, field, value) => {
//     const newBenefits = [...benefits];
//     newBenefits[index] = {
//       ...newBenefits[index],
//       [field]: value
//     };
//     onChange?.(newBenefits);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center space-x-2">
//         <label className="text-sm font-medium">
//           Phúc lợi công ty <span className="text-red-500">*</span>
//         </label>
//       </div>

//       {fields.map((field, index) => (
//         <div key={field.id} className="flex gap-4 items-start">
//           <div className="w-1/3">
//             <Select
//               value={benefits[index]?.benefitId}
//               onValueChange={(value) => handleBenefitChange(index, 'benefitId', value)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Chọn phúc lợi" />
//               </SelectTrigger>
//               <SelectContent>
//                 {availableBenefits.map(benefit => (
//                   <SelectItem
//                     key={benefit.benefitId}
//                     value={benefit.benefitId}
//                   >
//                     {benefit.benefitName}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex-1">
//             <Textarea
//               className="min-h-[80px]"
//               value={benefits[index]?.description || ""}
//               onChange={(e) => handleBenefitChange(index, 'description', e.target.value)}
//               placeholder="Mô tả phúc lợi"
//             />
//           </div>

//           <Button
//             variant="outline"
//             size="icon"
//             className="shrink-0"
//             disabled={fields.length === 1}
//             onClick={() => removeBenefit(index)}
//           >
//             <Trash className="h-4 w-4 text-red-500" />
//           </Button>
//         </div>
//       ))}

//       {fields.length < 3 && (
//         <Button
//           variant="outline"
//           className="mt-4"
//           onClick={addBenefit}
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           Thêm phúc lợi
//         </Button>
//       )}
//     </div>
//   );
// };

// export default CompanyBenefits;