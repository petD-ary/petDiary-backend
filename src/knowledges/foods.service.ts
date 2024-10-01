import { Injectable } from '@nestjs/common';
import { DestroyOptions, FindOptions, Op, UpdateOptions } from 'sequelize';

import { FoodDto, FoodDtoWithoutId } from './dto/food.dto';
import { Food } from './entity/food.entity';
import { Sequelize } from 'sequelize-typescript';

interface FoodOptions extends FindOptions {
  type?: string;
}

@Injectable()
export class FoodsService {
  async create(value: FoodDtoWithoutId) {
    Food.create(value);
    return;
  }

  async createAll(values: FoodDtoWithoutId[]) {
    for (const value of values) {
      await this.create(value);
    }
    return;
  }

  async getByAll(options?: FindOptions) {
    return Food.findAll(options);
  }

  async getBy(options?: FindOptions) {
    return Food.findOne(options);
  }

  async update(foodDto: FoodDto, options: UpdateOptions) {
    return Food.update(foodDto, options);
  }

  async delete(options: DestroyOptions) {
    return Food.destroy(options);
  }

  /**
   * 주어진 매개변수를 기반으로 Sequelize FindOptions 객체를 생성
   *
   * @param type 타입 필터
   * @param search summary, title json 데이터 중 value 에서 검색하기 위한 키워드
   * @param foodCookType 조리 타입 필터. 예: `cooking`, `preparation`
   * @returns - Sequelize FindOptions 객체
   */
  createFoodOptions(type: string, search: string, foodCookType: string) {
    const options: FoodOptions = {
      where: {
        type,
      },
    };

    if (search) {
      options.where = {
        ...options.where,
        [Op.or]: [
          Sequelize.literal(`EXISTS (
              SELECT 1
              FROM jsonb_each(summary)
              WHERE CAST(value AS TEXT) ILIKE '%${search}%'
            )`),
          Sequelize.literal(`EXISTS (
              SELECT 1
              FROM jsonb_each(title)
              WHERE CAST(value AS TEXT) ILIKE '%${search}%'
            )`),
        ],
      };
    }

    if (foodCookType) {
      options.where = {
        ...options.where,
        [Op.and]: [
          Sequelize.literal(`EXISTS (
              SELECT 1
              FROM jsonb_each(tag)
              WHERE CAST(value AS TEXT) ILIKE '%${foodCookType}%'
            )`),
        ],
      };
    }

    // sort 기능이 filter 로 변경됨
    // if (sort) {
    //   const [key, direction] = sort.split(',');

    //   if (key === 'cookedOrNot') {
    //     // 해당 배열 순서대로 정렬
    //     const priority = ['필수', '권장', '-'];
    //     const sortDirection = direction === 'high' ? 'ASC' : 'DESC';

    //     // PostgreSQL array_position 함수를 사용해서 priority 순서로 정렬
    //     options.order = [
    //       [
    //         Sequelize.fn(
    //           'array_position',
    //           Sequelize.literal(`ARRAY['${priority.join("','")}']`),
    //           Sequelize.literal(`"tag"->>'cookedOrNot'`),
    //         ),
    //         sortDirection,
    //       ],
    //     ];
    //   }
    // }

    return options;
  }
}
