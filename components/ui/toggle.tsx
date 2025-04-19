import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Replace the Toggle section in the "Train Model" tab with:
<div className="mb-6 flex justify-center">
  <Select onValueChange={(value: "healthcare" | "finance") => setSelectedSector(value)} defaultValue="healthcare">
    <SelectTrigger className="w-[180px] bg-blue-700/20 text-white border-blue-500/30">
      <SelectValue placeholder="Select Sector" />
    </SelectTrigger>
    <SelectContent className="bg-blue-700/50 text-white border-blue-500/30">
      <SelectItem value="healthcare">Healthcare</SelectItem>
      <SelectItem value="finance">Finance</SelectItem>
    </SelectContent>
  </Select>
</div>

function setSelectedSector(): void {
    throw new Error("Function not implemented.");
}
