"use client";

import Banner from "@/components/Products/Banner";
import { useParams, useSearchParams } from "next/navigation";
import Loading from "./loading";
import useProducts from "@/hooks/useProducts";
import FilterProductlist from "@/components/Products/FilterProductlist";
import { useEffect, useState } from "react";
import SortProductMobile from "@/components/Products/SortProductMobile";
import FilterProductMobile from "@/components/Products/FilterProductMobile";
import Icon from "@/components/shared/Icon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import ProductListCard from "@/components/Products/ProductlistCard";
import NoData from "@/components/shared/NoData";
import RadioButton from "@/components/Products/RadioButton";
import route from "@/routes";
// import { Dialog } from "@/components/ui/dialog";
// import Button from "@/components/shared/Button/Button";
// import { useRouter } from "next/router";
export const dynamic = "force-dynamic";
export const dynamicParams = false;
const Products = () => {
  console.log(process.env.NEXT_PUBLIC_API_ROOT, "NEXT_PUBLIC_API_ROOT");

  const params = useParams();
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(true);
  // const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // const toggleFilter = () => {
  //   setIsFilterOpen(!isFilterOpen);
  // };
  // const handleSort = () => {
  //   setIsSortOpen(!isSortOpen);
  // };

  const navigation_header = params?.slug?.[0];
  const category = searchParams.getAll("category");
  const subCategory = searchParams.getAll("sub_category");
  const color = searchParams.getAll("color");
  const size = searchParams.getAll("size");
  const name = searchParams.get("search");
  const min_price = searchParams.get("min_price");
  const max_price = searchParams.get("max_price");

  let filters = {};

  if (navigation_header) {
    filters = {
      ...filters,
      navigation_header: navigation_header,
    };
  }

  if (category) {
    filters = {
      ...filters,
      category: [...category],
    };
  }

  if (subCategory) {
    filters = {
      ...filters,
      sub_category: [...subCategory],
    };
  }

  if (name) {
    filters = {
      ...filters,
      name: name,
    };
  }

  if (min_price) {
    filters = {
      ...filters,
      min_price: min_price,
    };
  }

  if (color) {
    filters = {
      ...filters,
      color: color,
    };
  }

  if (size) {
    filters = {
      ...filters,
      size: size,
    };
  }

  if (max_price) {
    filters = {
      ...filters,
      max_price: max_price,
    };
  }

  console.log("filters: ", filters);

  // const [data, setData] = useState<PRODUCT | undefined>(undefined)

  const {
    data: products,
    isLoading,
    error,
  } = useProducts({
    ...filters,

    page: currentPage.toString(),
  });

  console.log("New products : ", products);
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error</div>;
  }

  if (!products) {
    return <div>Loading</div>;
  }

  if (products?.results?.product_data.length === 0) {
    return (
      <div>
        <NoData />
      </div>
    );
  }

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="relative-container">
      <div className="text-gray-500 text-base justify-center text-center mt-5 mb-5">
        Home
        {navigation_header && ` / ${decodeURIComponent(navigation_header)}`}
        {category && ` / ${category}`}
        {subCategory &&
          subCategory.length > 0 &&
          ` / ${subCategory
            .map((item) => decodeURIComponent(item))
            .join(" / ")}`}
      </div>
      {/* <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`${route.Products}/${navigation_header}`}>
              {navigation_header &&
                ` / ${decodeURIComponent(navigation_header)}`}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`${route.Products}/${navigation_header}/${category}`}
            >
              {category && ` / ${category}`}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`${route.Products}/${navigation_header}?${category}=="category.name"/${subCategory}`}
            >
              {subCategory &&
                subCategory.length > 0 &&
                ` / ${subCategory
                  .map((item) => decodeURIComponent(item))
                  .join(" / ")}`}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}

      <Banner />
      <div className="mx-auto max-w-screen-3xl">
        <div className="flex  m-4 relative">
          <div className="w-1/5 hidden md:block mt-4">
            <FilterProductlist
              filters={{
                navigation_header: navigation_header,
                cateory: category,
                subCategory: subCategory,
                // @ts-ignore
                min_price: min_price,
                max_price: max_price,
                categories_data: products?.results?.categories_data || [],
                //@ts-ignore
                product_data: products?.results || [],
              }}
            />
          </div>

          <div className="md:w-[80%]">
            <div className="hidden md:flex sticky top-0 justify-between  text-lg  ">
              <div className="text-lg text-gray-500 mt-4 ml-4 justify-end items-end text-end">
                {products?.results?.product_data.length} Items
              </div>
              {/* <div>
                <div
                  className="flex gap-4 cursor-pointer mt-4 mr-16"
                  onClick={handleSort}
                >
                  <h2 className="text-lg text-gray-default">Sort</h2>
                  <Icon name="Sort" size={20} />
                </div>
                {isSortOpen && (
                  <div className="absolute   bg-white  w-1/6 p-6">
                    <div className="flex-row justify-center text-base">
                      <div className="font-medium mb-10 ">Sort</div>
                      <RadioButton options={radioOptions} />
                    </div>
                  </div>
                )}
              </div> */}
            </div>
            <div className="flex flex-col overflow-y-auto max-h-[calc(100vh - 200px)]   w-full">
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 scroll justify-center items-start  md:grid-cols-5 gap-4
              lg:grid-cols-${isFilterOpen ? 4 : 5} 
              `}
              >
                {products?.results?.product_data.map((product, index) => (
                  <ProductListCard
                    key={index}
                    product={product}
                    // categories_data={products?.results?.categories_data}
                  />
                ))}
              </div>
            </div>
            <div className=" flex justify-center my-10">
              {products && products?.next !== null && (
                <div className="justify-center items-center">
                  <button
                    className="bg-primary py-2 px-6 text-white "
                    onClick={handleLoadMore}
                  >
                    <div className="flex items-center">
                      <div className=" text-lg">Load More</div>
                      <div>
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 25 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.5 16L18.5 12M18.5 12L14.5 8M18.5 12L6.5 12"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* mobile filter and sort bottom bar  */}

      <div className="flex justify-between sticky bottom-0 w-full md:hidden bg-white ">
        <div className="flex-item mx-auto p-4">
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex text-lg text-gray-default">
                Filter
                <Icon name="Filters" size={24} />
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="sm:max-w-[425px] mt-0 h-full"
            >
              <SheetHeader>
                <SheetTitle className=" items-center flex justify-between  ">
                  <div>Filters</div>
                  <SheetClose>
                    <Icon name="Close" size={20} />
                  </SheetClose>
                </SheetTitle>
              </SheetHeader>
              <DropdownMenuSeparator className="border-t border-gray-300 my-4" />
              <FilterProductMobile
                filters={{
                  navigation_header: navigation_header,
                  category: category,
                  subCategory: subCategory,
                  // @ts-ignore
                  min_price: min_price,
                  max_price: max_price,
                  categories_data: products?.results?.categories_data || [],
                  //@ts-ignore
                  product_data: products?.results || [],
                }}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* <div className="flex-item mx-auto p-4">
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex text-lg text-gray-default">
                Sort
                <Icon name="Sort" size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="w-full h-full">
              <SheetHeader>
                <SheetTitle className=" items-center flex justify-between  mb-12">
                  <div>Sort</div>
                  <SheetClose>
                    <Icon name="Close" size={20} />
                  </SheetClose>
                </SheetTitle>
              </SheetHeader>
              <SortProductMobile />
            </SheetContent>
          </Sheet>
        </div> */}
      </div>
    </div>
  );
};

export default Products;
