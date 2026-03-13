import { arrayRange } from "@/lib/utils";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext
} from "@/components/ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem
} from "@/components/ui/select";
import { useState } from "react";

export type IPagination = { currentPage: number; limit: number };

interface Props {
  totalPages: number;
  onChange: (p: IPagination) => void;
}

const CustomPagination = ({ totalPages, onChange }: Props) => {
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: 1,
    limit: 10
  });

  const updatePagination = (
    updater: IPagination | ((p: IPagination) => IPagination)
  ) => {
    setPagination(prev => {
      const next =
        typeof updater === "function"
          ? (updater as (p: IPagination) => IPagination)(prev)
          : updater;

      onChange(next);
      return next;
    });
  };


  return (
    <div className="flex items-center justify-center gap-4 mt-4 ">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        <Select defaultValue={pagination.limit.toString()}
          onValueChange={(val) => updatePagination(
            {
              currentPage: 1,
              limit: Number(val),
            })}>
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Pagination className='w-fit mx-0'>
        <PaginationContent className='gap-2 w-fit'>
          <PaginationItem className={pagination.currentPage <= 1
            ? 'pointer-events-none opacity-50'
            : 'cursor-pointer'}>
            <PaginationPrevious
              onClick={() => updatePagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
            />
          </PaginationItem>
          {/* pages */}
          {
            arrayRange(1, totalPages).map((item) => (
              <PaginationItem
                className={item === pagination.currentPage
                  ? 'pointer-events-none opacity-50 cursor-auto'
                  : 'cursor-pointer'}>
                <PaginationLink
                  onClick={() => updatePagination({ ...pagination, currentPage: item })}
                  isActive={item == pagination.currentPage}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ))
          }
          <PaginationItem
            className={totalPages === pagination.currentPage
              ? 'pointer-events-none opacity-50 cursor-auto'
              : 'cursor-pointer'}>
            <PaginationNext
              onClick={() => updatePagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CustomPagination;