/**
 * Custom Better-Auth Adapter for Supabase
 * Uses Supabase JavaScript client instead of direct PostgreSQL connection
 */

import { supabase } from '../supabase/client';

interface WhereCondition {
  field: string;
  operator: string;
  value: unknown;
}

function convertWhereToSupabaseFilter(table: string, where: WhereCondition[]) {
  let query = supabase.from(table).select('*');
  
  for (const condition of where) {
    const { field, operator, value } = condition;
    
    switch (operator) {
      case 'eq':
        query = query.eq(field, value);
        break;
      case 'ne':
        query = query.neq(field, value);
        break;
      case 'gt':
        query = query.gt(field, value);
        break;
      case 'gte':
        query = query.gte(field, value);
        break;
      case 'lt':
        query = query.lt(field, value);
        break;
      case 'lte':
        query = query.lte(field, value);
        break;
      case 'in':
        query = query.in(field, value as unknown[]);
        break;
      case 'contains':
        query = query.ilike(field, `%${value}%`);
        break;
      default:
        query = query.eq(field, value);
    }
  }
  
  return query;
}

export function supabaseAdapter() {
  console.log('🔵 Supabase Adapter initialized');
  
  return {
    id: 'supabase',
    
    async create(data: { model: string; data: Record<string, unknown> }) {
      const { model, data: record } = data;
      console.log(`🔵 Supabase: Creating ${model}`, Object.keys(record));
      
      const { data: result, error } = await supabase
        .from(model)
        .insert(record)
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Supabase: Failed to create ${model}:`, error.message);
        throw new Error(`Failed to create ${model}: ${error.message}`);
      }
      
      console.log(`✅ Supabase: Created ${model} successfully`);
      return result;
    },
    
    async findOne(data: { model: string; where: WhereCondition[] }) {
      const { model, where } = data;
      
      const query = convertWhereToSupabaseFilter(model, where);
      const { data: result, error } = await query.single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw new Error(`Failed to find ${model}: ${error.message}`);
      }
      
      return result;
    },
    
    async findMany(data: { 
      model: string; 
      where?: WhereCondition[]; 
      limit?: number; 
      offset?: number; 
      sortBy?: { field: string; direction: 'asc' | 'desc' } 
    }) {
      const { model, where, limit, offset, sortBy } = data;
      
      let query = where 
        ? convertWhereToSupabaseFilter(model, where)
        : supabase.from(model).select('*');
      
      if (sortBy) {
        query = query.order(sortBy.field, { ascending: sortBy.direction === 'asc' });
      }
      
      if (limit) {
        query = query.limit(limit);
      }
      
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }
      
      const { data: result, error } = await query;
      
      if (error) {
        throw new Error(`Failed to find ${model}: ${error.message}`);
      }
      
      return result || [];
    },
    
    async update(data: { model: string; where: WhereCondition[]; update: Record<string, unknown> }) {
      const { model, where, update } = data;
      
      // Build update query
      let query = supabase.from(model).update(update);
      
      // Apply where conditions
      for (const condition of where) {
        const { field, value } = condition;
        query = query.eq(field, value);
      }
      
      const { data: result, error } = await query.select().single();
      
      if (error) {
        throw new Error(`Failed to update ${model}: ${error.message}`);
      }
      
      return result;
    },
    
    async updateMany(data: { model: string; where: WhereCondition[]; update: Record<string, unknown> }) {
      const { model, where, update } = data;
      
      let query = supabase.from(model).update(update);
      
      for (const condition of where) {
        const { field, value } = condition;
        query = query.eq(field, value);
      }
      
      const { data: result, error } = await query.select();
      
      if (error) {
        throw new Error(`Failed to update ${model}: ${error.message}`);
      }
      
      return result || [];
    },
    
    async delete(data: { model: string; where: WhereCondition[] }) {
      const { model, where } = data;
      
      let query = supabase.from(model).delete();
      
      for (const condition of where) {
        const { field, value } = condition;
        query = query.eq(field, value);
      }
      
      const { error } = await query;
      
      if (error) {
        throw new Error(`Failed to delete ${model}: ${error.message}`);
      }
    },
    
    async deleteMany(data: { model: string; where: WhereCondition[] }) {
      const { model, where } = data;
      
      let query = supabase.from(model).delete();
      
      for (const condition of where) {
        const { field, value } = condition;
        query = query.eq(field, value);
      }
      
      const { error } = await query;
      
      if (error) {
        throw new Error(`Failed to delete ${model}: ${error.message}`);
      }
    },
  };
}
