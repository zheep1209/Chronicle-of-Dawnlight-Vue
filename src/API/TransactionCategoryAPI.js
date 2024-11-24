import {del, get, post} from '@/utils/request.js';

// 获取所有分类
export const getAllCategories = () => {
    return get("/transactionCategory/getAllCategory");
};

// 创建分类
export const createCategory = (name) => {
        return post(`/transactionCategory/create?name=${name}`);
};

// 删除分类
export const deleteCategory = (id) => {
    return del(`/transactionCategory/delete/${id}`);
};
