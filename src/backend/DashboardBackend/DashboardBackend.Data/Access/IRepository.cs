// Copyright 2024 (c) MIDIFrogs (contact https://github.com/MIDIFrogs)
// Distributed under MIT license. See LICENSE.md file in the project root for more information
namespace DashboardBackend.Data.Access
{
    public interface IRepository<TModel> where TModel : class
    {
        Task<IEnumerable<TModel>> GetAllAsync(int skip = 0, int take = 10);

        Task<TModel?> GetByIdAsync(int id);

        Task AddAsync(TModel productGroup);

        Task UpdateAsync(TModel productGroup);

        Task DeleteAsync(int id);
    }
}